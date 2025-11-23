"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PricesResponse } from "@/lib/types";
import { localeDate } from "@/lib/format";

const Line = dynamic(
  async () => {
    const reactChartJs2 = await import("react-chartjs-2");
    await import("chart.js/auto");
    return reactChartJs2.Line;
  },
  { ssr: false },
);

export function PricesChart({
  data,
  crop,
  region,
}: {
  data: PricesResponse;
  crop: string;
  region: string;
}) {
  const labels = data.series.map((r) => localeDate(r.date));
  const avg = data.series.map((r) => r.price_avg);
  const unit = data.series[0]?.unit ?? "";

  const last = data.series.at(-1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Precios mayoristas (últimos 60 - 90 días)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Line
          data={{
            labels,
            datasets: [{ label: `Precio Promedio (${unit})`, data: avg }],
          }}
          options={{
            responsive: true,
            plugins: { legend: { position: "bottom" } },
            scales: { y: { title: { display: true, text: unit || "Precio" } } },
          }}
        />
        <p className="text-sm text-muted-foreground">
          {!data.series.length ? (
            <>
              ℹ️ Sin datos recientes de precios para <b>{crop}</b> en{" "}
              <b>{region || "todas las regiones"}</b>.
            </>
          ) : (
            <>
              Último precio para <b>{crop}</b> en{" "}
              <b>{last?.market || last?.region}</b> el{" "}
              <b>{last ? localeDate(last.date) : "-"}</b>:{" "}
              <b>
                {last?.price_avg} {last?.unit || ""}
              </b>
            </>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
