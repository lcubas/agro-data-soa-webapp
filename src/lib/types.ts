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
  suggested_sowing_start?: string | null;
  risks_next_10d: {
    frost_dates: string[];
    high_rain_probability_dates: string[];
  };
  price_ranking: { market: string; avg: number; unit?: string }[];
};
