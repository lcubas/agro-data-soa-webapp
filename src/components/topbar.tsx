"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const active = pathname === href || (href === "/" && pathname === "/");
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm ${
        active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
};

export default function Topbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <div className="font-semibold">🌱 AgroData Perú</div>
        <nav className="flex items-center gap-1">
          <NavLink href="/">Dashboard</NavLink>
          <NavLink href="/arquitectura">Arquitectura SOA</NavLink>
        </nav>
      </div>
    </header>
  );
}
