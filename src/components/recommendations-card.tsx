"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecommendationsResponse } from "@/lib/types";

type Props = { recommendation: RecommendationsResponse };

export function RecommendationsCard({ recommendation }: Props) {
  const weather = recommendation.weather_analysis || {
    score: 0,
    status: "NEUTRAL",
    message: "Sin datos",
  };
  const fin = recommendation.financial_analysis || {
    score: 50,
    verdict: "-",
    months_analyzed: 0,
    explanation: "",
  };
  const total = recommendation.total_viability || {
    score: 0,
    recommendation: "NO DEFINIDO",
  };

  let weatherColor = "text-blue-700 bg-blue-50 border-blue-200";
  if (weather.status === "NO_SEMBRAR")
    weatherColor = "text-red-700 bg-red-50 border-red-200";
  else if (weather.status === "SEMBRAR")
    weatherColor = "text-green-700 bg-green-50 border-green-200";
  else if (weather.status === "ESPERAR")
    weatherColor = "text-yellow-700 bg-yellow-50 border-yellow-200";

  let finBarColor = "bg-yellow-500";
  if (fin.score >= 75) finBarColor = "bg-green-600";
  else if (fin.score <= 40) finBarColor = "bg-red-500";

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            🌱 Resultado del Análisis
          </span>
          <span className="text-xs font-mono bg-slate-800 text-white px-2 py-1 rounded">
            Algoritmo v2.0
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 1. VIABILIDAD CLIMÁTICA */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">
            1. Viabilidad Climática
          </h3>
          <div className={`p-4 rounded-lg border-l-4 ${weatherColor}`}>
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">{weather.message}</span>
              <span className="text-2xl font-black opacity-20">
                {weather.score}/100
              </span>
            </div>
          </div>
          <div className="mt-2 pl-2 text-sm text-slate-600 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <span>❄️ Heladas:</span>
              {recommendation.risks_next_10d.frost_dates.length > 0 ? (
                <span className="font-bold text-red-600">ALTO</span>
              ) : (
                <span className="font-bold text-green-600">BAJO</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span>🌧️ Lluvias:</span>
              {recommendation.risks_next_10d.high_rain_probability_dates
                .length > 0 ? (
                <span className="font-bold text-yellow-600">ALTO</span>
              ) : (
                <span className="font-bold text-green-600">NORMAL</span>
              )}
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* 2. VIABILIDAD FINANCIERA */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">
            2. Viabilidad Financiera
          </h3>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-slate-700">
              Tendencia de Mercado ({recommendation.crop})
            </span>
            <span className="font-bold">{fin.score}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full ${finBarColor} transition-all duration-1000`}
              style={{ width: `${fin.score}%` }}
            />
          </div>
          {fin.explanation && (
            <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100">
              {fin.explanation}
            </p>
          )}
        </div>

        <hr className="border-slate-200 border-dashed" />

        {/* 3. RECOMENDACIONES (BLOQUE SUAVE) */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">
            3. Recomendaciones
          </h3>
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  CONCLUSIÓN DEL SISTEMA
                </h2>
                <div
                  className={`text-2xl font-black ${total.score >= 50 ? "text-green-600" : "text-red-600"}`}
                >
                  {total.recommendation}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800">
                  {total.score}%
                </div>
                <div className="text-[10px] text-slate-500">
                  Índice de Éxito
                </div>
              </div>
            </div>

            <div className="mt-3 flex gap-4 text-xs text-slate-600 border-t border-slate-200 pt-3">
              <div>
                <span className="block text-slate-400 font-semibold">
                  UBICACIÓN
                </span>
                {recommendation.location.region}
              </div>
              <div>
                <span className="block text-slate-400 font-semibold">
                  VENTANA SUGERIDA
                </span>
                <span
                  className={`font-bold ${total.recommendation.includes("SEMBRAR") ? "text-green-700" : "text-orange-600"}`}
                >
                  {recommendation.suggested_sowing_start || "No definida"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
