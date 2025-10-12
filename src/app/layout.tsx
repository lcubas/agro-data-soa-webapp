import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgroData Perú - Asistente para el Agricultor",
  description:
    "Dashboard SOA: clima, precios y recomendaciones para agricultores.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌱</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`bg-background text-foreground ${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh`}
      >
        {children}
        <Toaster position="top-right" richColors />
        <footer className="border-t mt-16">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
            © 2025 AgroData Perú - Proyecto académico SOA.
          </div>
        </footer>
      </body>
    </html>
  );
}
