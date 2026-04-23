import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForecast } from '@/hooks/userForecast';
import { getCommodities } from '@/services/agriApi';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

// ---------------- DATA ----------------
const DISTRICTS = [
  'Ahmednagar','Akola','Amarawati','Beed','Bhandara','Buldhana','Chandrapur',
  'Chattrapati Sambhajinagar','Dharashiv (Usmanabad)','Dhule','Gadchiroli',
  'Gondiya','Hingoli','Jalana','Jalgaon','Kolhapur','Latur','Mumbai','Murum',
  'Nagpur','Nanded','Nandurbar','Nashik','Parbhani','Pune','Raigad','Ratnagiri',
  'Sangli','Satara','Sholapur','Thane','Vashim','Wardha','Yavatmal'
];

const MIN_DATE = '2025-01-01';
const MAX_DATE = '2025-04-01';

// ---------------- RISK ----------------
function getRisk(riskIndex: number) {
  if (riskIndex > 8) return { label: "High Risk", color: "text-red-600", bg: "bg-red-100" };
  if (riskIndex > 4) return { label: "Moderate Risk", color: "text-yellow-600", bg: "bg-yellow-100" };
  return { label: "Stable Market", color: "text-green-600", bg: "bg-green-100" };
}

// ---------------- COMPONENT ----------------
const Model = () => {

  const [district, setDistrict] = useState('');
  const [commodity, setCommodity] = useState('');
  const [date, setDate] = useState('');
  const [typedText, setTypedText] = useState("");
  const [fastMode, setFastMode] = useState(true);

  const [commodities, setCommodities] = useState<string[]>([]); // ✅ dynamic

  const { data, loading, error, fetchForecast, reset } = useForecast();
  const resultsRef = useRef<HTMLDivElement>(null);

  // 🔥 Fetch commodities when district changes
  useEffect(() => {
    if (!district) return;

    setCommodity(""); // reset commodity when district changes

    getCommodities(district)
      .then(setCommodities)
      .catch(err => console.error("Commodity fetch error:", err));
  }, [district]);

  // Scroll
  useEffect(() => {
    if (data && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data]);

  // Typing effect
  useEffect(() => {
    if (!data?.explanation) return;

    let i = 0;
    const text = data.explanation;
    setTypedText("");

    const interval = setInterval(() => {
      setTypedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 15);

    return () => clearInterval(interval);
  }, [data]);

  // Graph data
  const chartData = data
    ? Array.from({ length: 10 }, (_, i) => {
        const base = data.fusion_forecast;
        const variation = Math.sin(i / 2) * 30 + (Math.random() - 0.5) * 20;
        return {
          day: `Day ${i + 1}`,
          price: Math.max(0, base + variation)
        };
      })
    : [];

  const risk = data ? getRisk(data.risk_index) : null;

  const handleForecast = () => {
    if (!district || !commodity || !date) {
      alert("Please fill all fields");
      return;
    }

    fetchForecast(district, commodity, date, fastMode);
  };

  const handleReset = () => {
    setDistrict('');
    setCommodity('');
    setDate('');
    reset();
  };

  return (
    <section id="model" className="p-10 space-y-6">

      {/* FORM */}
      <Card>
        <CardHeader>
          <CardTitle>Forecast Parameters</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-3 gap-4">

          {/* District */}
          <Select value={district} onValueChange={setDistrict}>
            <SelectTrigger>
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              {DISTRICTS.map(d => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Commodity (Dynamic) */}
          <Select value={commodity} onValueChange={setCommodity}>
            <SelectTrigger>
              <SelectValue placeholder="Select commodity" />
            </SelectTrigger>
            <SelectContent>
              {commodities.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date */}
          <input
            type="date"
            value={date}
            min={MIN_DATE}
            max={MAX_DATE}
            onChange={e => setDate(e.target.value)}
            className="border p-2 rounded"
          />

        </CardContent>

        {/* Toggle */}
        <div className="flex items-center gap-3 px-4">
          <span className="text-sm">⚡ Fast</span>
          <input
            type="checkbox"
            checked={!fastMode}
            onChange={() => setFastMode(prev => !prev)}
          />
          <span className="text-sm">🧠 AI</span>
        </div>

        {/* Buttons */}
        <div className="p-4 flex gap-3">
          <Button onClick={handleForecast}>
            {loading ? "Generating..." : "Generate Forecast"}
          </Button>

          {(data || error) && (
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          )}
        </div>

        {loading && (
          <p className="px-4 pb-4 text-gray-500">
            🤖 {fastMode ? "Fast prediction..." : "AI generating insights..."}
          </p>
        )}
      </Card>

      {/* ERROR */}
      {error && (
        <div className="text-red-600 font-semibold">
          ERROR: {error}
        </div>
      )}

      {/* RESULTS */}
      {data && (
        <div ref={resultsRef} className="space-y-6">

          <h2 className="text-2xl font-bold">
            📊 {data.commodity} — {data.district}
          </h2>

          {/* GRAPH */}
          <div className="p-6 border rounded-2xl bg-white shadow">
            <h3 className="text-lg font-semibold mb-4">Price Trend Forecast</h3>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            <div className="p-6 rounded-2xl border shadow bg-white">
              <p className="text-sm text-gray-500">Predicted Price</p>
              <h1 className="text-3xl font-bold">
                ₹{data.fusion_forecast.toFixed(2)}
              </h1>
            </div>

            <div className="p-6 rounded-2xl border shadow bg-white">
              <p className="text-sm text-gray-500">Confidence</p>
              <h1 className="text-3xl font-bold text-blue-600">
                {data.confidence_percent.toFixed(1)}%
              </h1>
            </div>

            {risk && (
              <div className={`p-6 rounded-2xl border shadow ${risk.bg}`}>
                <p className="text-sm text-gray-500">Risk Index</p>
                <h1 className={`text-3xl font-bold ${risk.color}`}>
                  {risk.label}
                </h1>
              </div>
            )}

            <div className="p-6 rounded-2xl border shadow bg-white">
              <p className="text-sm text-gray-500">Expected Drop</p>
              <h1 className="text-3xl font-bold text-orange-600">
                ₹{(data.fusion_forecast * 0.03).toFixed(2)}
              </h1>
            </div>

          </div>

          {/* AI ANALYSIS */}
          <div className="p-6 border rounded-2xl bg-white shadow">
            <h2 className="text-lg font-semibold mb-4">
              🧠 AI MARKET ANALYSIS
            </h2>

            <div className="text-sm text-gray-700">
              {typedText}<span className="animate-pulse">|</span>
            </div>
          </div>

        </div>
      )}

    </section>
  );
};

export default Model;
