export type WeatherDay = {
  date: string;
  tmin: number;
  tmax: number;
  precip_mm?: number;
  precip_prob?: number;
  frost_risk?: "bajo" | "medio" | "alto";
};

export type WeatherResponse = { daily: WeatherDay[] };

export type PricesPoint = {
  date: string;
  price_avg: number;
  unit?: string;
  market?: string;
  region?: string;
};

export type PricesResponse = { series: PricesPoint[] };

export type RecommendationsResponse = {
  crop: string;
  location: { region?: string; lat: number; lon: number };

  // Nuevas Estructuras del Algoritmo v2.0
  weather_analysis: {
    score: number;
    status: string;
    message: string;
  };
  financial_analysis: {
    score: number;
    verdict: string;
    months_analyzed: number;
    explanation?: string;
  };
  total_viability: {
    score: number;
    recommendation: string;
  };

  suggested_sowing_start?: string | null;
  risks_next_10d: {
    frost_dates: string[];
    high_rain_probability_dates: string[];
  };
  price_ranking: { market: string; avg: number; unit?: string }[];

  // Compatibilidad (Opcional)
  recommendation_text?: string;
  action_code?: string;
};
