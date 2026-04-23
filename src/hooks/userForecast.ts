import { useState, useCallback } from "react";
import { getForecast, ForecastResponse } from "../services/agriApi";

interface UseForecastReturn {
  data: ForecastResponse | null;
  loading: boolean;
  error: string | null;
  fetchForecast: (
    district: string,
    commodity: string,
    forecast_date: string,
    fast: boolean   // ✅ NEW
  ) => Promise<void>;
  reset: () => void;
}

export function useForecast(): UseForecastReturn {
  const [data, setData] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchForecast = useCallback(
    async (
      district: string,
      commodity: string,
      forecast_date: string,
      fast: boolean   // ✅ NEW
    ) => {

      console.log("🔥 fetchForecast called");
      console.log("Mode:", fast ? "FAST ⚡" : "AI 🧠");

      // validation
      if (!district.trim() || !commodity.trim() || !forecast_date) {
        setError("Please fill all fields");
        return;
      }

      setLoading(true);
      setError(null);
      setData(null);

      try {
        console.log("📡 Calling API...");

        const result = await getForecast(
          district.trim(),
          commodity.trim(),
          forecast_date,
          fast   // ✅ PASSING MODE
        );

        console.log("✅ API SUCCESS:", result);

        setData(result);

      } catch (err) {
        console.error("❌ API ERROR:", err);

        const message =
          err instanceof Error ? err.message : "Something went wrong";

        setError(message);

      } finally {
        setLoading(false);
        console.log("⏹ Loading finished");
      }
    },
    []
  );

  const reset = useCallback(() => {
    console.log("🔄 Reset called");
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, fetchForecast, reset };
}