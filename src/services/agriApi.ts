export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface ForecastResponse {
  district: string;
  commodity: string;
  forecast_date: string;
  forecast_horizon_days: number;
  fusion_forecast: number;
  confidence_percent: number;
  risk_index: number;
  sentiment_score: number;
  news_count: number;
  recommended_safety_stock: number;
  explanation: string;
}

export async function getForecast(
  district: string,
  commodity: string,
  forecast_date: string,
  fast: boolean   // ✅ NEW PARAM
): Promise<ForecastResponse> {

  const response = await fetch(
    `${BASE_URL}/forecast?fast=${fast}`,   // ✅ IMPORTANT
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ district, commodity, forecast_date }),
    }
  );

  if (!response.ok) {
    let message = "Forecast request failed";
    try {
      const err = await response.json();
      message = err.detail || message;
    } catch (_) {}
    throw new Error(message);
  }

  return response.json();
}

export async function getCommodities(district: string): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/commodities/${encodeURIComponent(district)}`);

  if (!response.ok) {
    throw new Error("Could not load commodities for this district");
  }

  const data = await response.json();
  return data.commodities || [];
}

export async function downloadCatalog(): Promise<void> {
  const response = await fetch(`${BASE_URL}/catalog/download`);

  if (!response.ok) {
    throw new Error("Could not download the product catalog");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "parthaj-orchard-catalog.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function recordInquiry(payload: {
  inquiry_type: string;
  source: string;
  product?: string;
  message?: string;
}): Promise<string> {
  const response = await fetch(`${BASE_URL}/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Could not submit your inquiry");
  }

  const data = await response.json();
  return data.message || "Inquiry received.";
}
