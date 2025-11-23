"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PricesResponse } from "@/lib/types";
import { localeDate } from "@/lib/format";

// Importamos el Gráfico de BARRAS (Bar) en vez de Línea
const BarChart = dynamic(
  async () => {
    const reactChartJs2 = await import("react-chartjs-2");
    await import("chart.js/auto");
    return reactChartJs2.Bar;
  },
  { ssr: false },
);

const MONTHS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export function PricesChart({
  data,
  crop,
  region,
}: {
  data: PricesResponse;
  crop: string;
  region: string;
}) {
  // Estado para el selector de año
  const [selectedYear, setSelectedYear] = useState(2025);

  // --- LÓGICA DE AGRUPACIÓN MENSUAL ---
  const processedData = useMemo(() => {
    // Arrays para acumular sumas y contar registros por mes (índices 0-11)
    const sums = new Array(12).fill(0);
    const counts = new Array(12).fill(0);

    if (data && data.series) {
      data.series.forEach((item) => {
        // Parseamos la fecha "YYYY-MM-DD"
        const parts = item.date.split("-");
        const y = parseInt(parts[0]);
        const m = parseInt(parts[1]); // 1 = Enero

        // Filtramos por el año seleccionado
        if (y === selectedYear) {
          const monthIndex = m - 1; // Ajustamos a índice 0
          if (monthIndex >= 0 && monthIndex < 12) {
            sums[monthIndex] += item.price_avg;
            counts[monthIndex] += 1;
          }
        }
      });
    }

    // Calculamos el promedio. Si no hay datos (count 0), devolvemos null (barra vacía)
    return sums.map((sum, i) => (counts[i] > 0 ? sum / counts[i] : null));
  }, [data, selectedYear]);

  const unit = data.series?.[0]?.unit || "S/";
  const last = data.series?.at(-1);

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">
            Variación Mensual de Precios: {crop}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Promedio mensual en Mercados Mayoristas
          </p>
        </div>

        {/* --- SELECTOR DE AÑO --- */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Año:</span>
          <select
            className="h-9 w-24 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="h-[350px] w-full relative">
          <BarChart
            data={{
              labels: MONTHS,
              datasets: [
                {
                  label: `Precio Promedio (${unit})`,
                  data: processedData,
                  backgroundColor: "rgba(59, 130, 246, 0.8)", // Azul corporativo
                  hoverBackgroundColor: "rgba(37, 99, 235, 1)",
                  borderRadius: 4, // Barras redondeadas
                  barPercentage: 0.6,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false }, // Ocultamos leyenda redundante
                tooltip: {
                  callbacks: {
                    label: (context) =>
                      ` Precio: S/ ${Number(context.raw).toFixed(2)}`,
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: false,
                  title: { display: true, text: `Precio (${unit})` },
                  grid: { color: "#f1f5f9" },
                },
                x: {
                  grid: { display: false },
                },
              },
            }}
          />
        </div>

        <div className="pt-2 border-t border-slate-100 text-sm text-muted-foreground flex items-start gap-2">
          <span>📊</span>
          <p>
            {!data.series.length ? (
              "Sin datos históricos disponibles."
            ) : (
              <>
                <b>Referencia:</b> El último precio registrado (
                <i>{last?.market}</i>) fue de
                <b> S/ {last?.price_avg.toFixed(2)}</b> el día{" "}
                <b>{last ? localeDate(last.date) : "-"}</b>.
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
