import Topbar from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ArquitecturaPage() {
  return (
    <>
      <Topbar />
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <Card id="arquitectura">
          <CardHeader>
            <CardTitle>Arquitectura SOA (resumen)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 leading-7">
              <li>
                <b>Servicios externos:</b> Pronóstico del tiempo y precios
                mayoristas.
              </li>
              <li>
                <b>Adaptadores propios:</b> <code>/api/weather</code>,{" "}
                <code>/api/prices</code>.
              </li>
              <li>
                <b>Orquestación:</b> <code>/api/recommendations</code> compone
                clima+precios.
              </li>
              <li>
                <b>Web app:</b> Este dashboard (stateless, JSON over HTTP).
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
