"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getFirebaseAuthErrorMessage } from "@/lib/firebase/getFirebaseAuthErrorMessage";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, loginWithGoogle, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Completa email y contraseña");
      return;
    }

    setSubmitting(true);
    try {
      await loginWithEmail(email, password);
      toast.success("Sesión iniciada correctamente");
      router.push("/dashboard");
    } catch (err: any) {
      const errorMessage = getFirebaseAuthErrorMessage(err.code || err.message);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setSubmitting(true);
    try {
      await loginWithGoogle();
      toast.success("Sesión iniciada con Google");
      router.push("/dashboard");
    } catch (err: any) {
      const errorMessage = getFirebaseAuthErrorMessage(err.code || err.message);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <AuthCard
      title="Iniciar sesión"
      description="Accede a tu cuenta de AgroData Perú"
    >
      <div className="space-y-6">
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              disabled={submitting}
              required
              autoComplete="email"
            />
          </div>

          <PasswordInput
            id="password"
            label="Contraseña"
            value={password}
            onChange={setPassword}
            disabled={submitting}
            autoComplete="current-password"
            required
          />

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              O continúa con
            </span>
          </div>
        </div>

        <GoogleSignInButton onClick={handleGoogleAuth} disabled={submitting} />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">¿No tienes cuenta? </span>
          <Link
            href="/registro"
            className="text-primary hover:underline font-medium"
          >
            Regístrate aquí
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
