from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import feedparser
import urllib.parse
import json
from datetime import datetime
from pathlib import Path
from typing import Optional
from transformers import pipeline
from groq import Groq   # ✅ BACK TO GROQ

# =====================================================
# CONFIG
# =====================================================

MAX_HORIZON_DAYS = 90
CONFIDENCE_DECAY_PER_DAY = 0.4

# =====================================================
# LOAD DATA
# =====================================================

historical_df = pd.read_csv("data/processed/phase2_feature_complete.csv")
historical_df["date"] = pd.to_datetime(historical_df["date"])

VALID_KEYWORDS = [
    "Apple","Banana","Orange","Mango","Papaya","Guava","Pomegranate","Grapes",
    "Tomato","Onion","Potato","Carrot","Cabbage","Cauliflower","Brinjal",
    "Spinach","Wheat","Rice","Maize","Jowar","Bajra","Soyabean","Groundnut",
    "Garlic","Ginger","Green Gram","Bengal Gram"
]

def is_valid_crop(name):
    return any(k.lower() in name.lower() for k in VALID_KEYWORDS)

filtered_df = historical_df[historical_df["commodity"].apply(is_valid_crop)]

# =====================================================
# MODELS
# =====================================================

xgb_model = joblib.load("models/xgb_price_model.pkl")
le_district = joblib.load("models/district_encoder.pkl")
le_commodity = joblib.load("models/commodity_encoder.pkl")

# ✅ FIX: Force PyTorch (avoid TensorFlow errors)
sentiment_model = pipeline("sentiment-analysis", framework="pt")

# ✅ GROQ CLIENT
client = Groq(api_key="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")

# =====================================================
# APP
# =====================================================

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# REQUEST MODEL
# =====================================================

class ForecastRequest(BaseModel):
    district: str
    commodity: str
    forecast_date: str

class InquiryRequest(BaseModel):
    inquiry_type: str
    source: str
    product: Optional[str] = None
    message: Optional[str] = None

# =====================================================
# UTIL FUNCTIONS
# =====================================================

def fetch_news(commodity):
    query = f"{commodity} India agriculture price mandi"
    encoded = urllib.parse.quote(query)
    url = f"https://news.google.com/rss/search?q={encoded}&hl=en-IN&gl=IN&ceid=IN:en"
    feed = feedparser.parse(url)
    return [entry.title for entry in feed.entries[:3]]

def compute_sentiment(titles):
    if not titles:
        return 0, 0

    scores = []
    for t in titles:
        result = sentiment_model(t)[0]
        score = result["score"]
        if result["label"] == "NEGATIVE":
            score = -score
        scores.append(score)

    return float(np.mean(scores)), len(scores)

def compute_risk(sentiment, count):
    if count == 0:
        return 0
    return abs(sentiment) * count

def safety_stock(std, lead_time, risk, horizon):
    z = 1.65
    base = z * std * np.sqrt(lead_time)
    return float(base * (1 + horizon/60) * (1 + min(risk/20, 0.5)))

# =====================================================
# LLM FUNCTION (GROQ + LLAMA)
# =====================================================

def generate_llm_explanation(
    district, commodity, forecast_date,
    base_price, sentiment, risk,
    confidence, stock, headlines, horizon
):

    news_text = "\n".join(headlines[:3]) if headlines else "No news available."

    prompt = f"""
You are an expert agricultural analyst.

District: {district}
Commodity: {commodity}
Forecast Date: {forecast_date}
Forecast Horizon: {horizon} days
Predicted Price: {round(base_price,2)}

Market Indicators:
- Sentiment Score: {round(sentiment,2)}
- Risk Index: {round(risk,2)}

Recent News:
{news_text}

Explain:
1. Price trend
2. Market stability
3. Supply-demand outlook
4. Advice for farmers

Keep it concise and professional.
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",   # ✅ FREE + FAST
        messages=[
            {"role": "system", "content": "You are an agricultural expert."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.4,
        max_tokens=500
    )

    return response.choices[0].message.content

# =====================================================
# API ENDPOINTS
# =====================================================

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Parthaj Orchard backend is running"}

@app.get("/catalog/download")
def download_catalog():
    from fastapi.responses import Response

    catalog_text = """PARTHAJ ORCHARD PVT. LTD.
Premium Indian Agricultural Export Catalog

Fresh Fruits
- Mangoes
- Bananas
- Grapes
- Pomegranates
- Oranges

Vegetables
- Onions
- Potatoes
- Tomatoes
- Peppers
- Okra

Grains & Cereals
- Basmati Rice
- Wheat
- Millets
- Pulses
- Lentils

Oil Seeds
- Sesame
- Mustard
- Sunflower
- Groundnut
- Castor

Spices & Herbs
- Turmeric
- Cumin
- Coriander
- Cardamom
- Black Pepper

Contact
Phone: +91 99213 20091
Email: parthajorchardpvtltd@gmail.com
Address: Kasliwal Classic Phase-1, Flat 11, Tapdiyanagar, Aurangabad, MH 431001, India
"""

    return Response(
        content=catalog_text,
        media_type="text/plain",
        headers={"Content-Disposition": 'attachment; filename="parthaj-orchard-catalog.txt"'},
    )

@app.post("/inquiries")
def create_inquiry(request: InquiryRequest):
    inquiries_dir = Path("data")
    inquiries_dir.mkdir(exist_ok=True)
    inquiries_file = inquiries_dir / "inquiries.jsonl"

    payload = {
        "created_at": datetime.utcnow().isoformat() + "Z",
        "inquiry_type": request.inquiry_type,
        "source": request.source,
        "product": request.product,
        "message": request.message,
    }

    with inquiries_file.open("a", encoding="utf-8") as file:
        file.write(json.dumps(payload) + "\n")

    return {
        "status": "received",
        "message": "Thanks. Our export team will follow up soon.",
    }

@app.get("/commodities/{district}")
def get_commodities(district: str):
    df = filtered_df[filtered_df["district"] == district]
    return {"commodities": sorted(df["commodity"].unique().tolist())}

@app.post("/forecast")
def forecast(request: ForecastRequest, fast: bool = True):

    subset = filtered_df[
        (filtered_df["district"] == request.district) &
        (filtered_df["commodity"] == request.commodity)
    ].sort_values("date")

    if len(subset) < 15:
        raise HTTPException(status_code=400, detail="Not enough data")

    base_price = subset.iloc[-1]["modal_price"]

    if fast:
        sentiment, news_count, risk = 0, 0, 0
        explanation = "Fast mode: instant prediction without deep analysis."

    else:
        try:
            print("🧠 AI MODE STARTED")

            titles = fetch_news(request.commodity)
            sentiment, news_count = compute_sentiment(titles)
            risk = compute_risk(sentiment, news_count)

            explanation = generate_llm_explanation(
                request.district,
                request.commodity,
                request.forecast_date,
                base_price,
                sentiment,
                risk,
                90,
                0,
                titles,
                5
            )

            print("✅ AI SUCCESS")

        except Exception as e:
            print("❌ AI ERROR:", e)

            sentiment, news_count, risk = 0, 0, 0
            explanation = "AI analysis unavailable. Showing basic forecast."

    confidence = max(30, 90 - 5 * CONFIDENCE_DECAY_PER_DAY)
    stock = safety_stock(subset["modal_price"].std(), 5, risk, 5)

    return {
        "district": request.district,
        "commodity": request.commodity,
        "forecast_date": request.forecast_date,
        "forecast_horizon_days": 5,
        "fusion_forecast": base_price,
        "confidence_percent": confidence,
        "risk_index": risk,
        "sentiment_score": sentiment,
        "news_count": news_count,
        "recommended_safety_stock": stock,
        "explanation": explanation
    }
