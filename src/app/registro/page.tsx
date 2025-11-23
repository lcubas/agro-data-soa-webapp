"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { usePasswordValidation } from "@/hooks/usePasswordValidation";
import { toast } from "sonner";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { PasswordRequirements } from "@/components/auth/PasswordRequirements";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getFirebaseAuthErrorMessage } from "@/lib/firebase/getFirebaseAuthErrorMessage";

export default function RegisterPage() {
  const router = useRouter();
  const { registerWithEmail, loginWithGoogle, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { validations, strength, isValid } = usePasswordValidation(password);
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      toast.error("Completa todos los campos");
      return;
    }

    if (!isValid) {
      toast.error("La contraseña no cumple con los requisitos mínimos");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setSubmitting(true);
    try {
      await registerWithEmail(email, password);
      toast.success("Usuario registrado exitosamente");
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
      toast.success("Cuenta creada con Google");
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
    <AuthCard title="Crear cuenta" description="Regístrate en AgroData Perú">
      <div className="space-y-6">
        <form onSubmit={handleRegister} className="space-y-4">
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
            autoComplete="new-password"
            required
          />

          <PasswordInput
            id="confirmPassword"
            label="Confirmar contraseña"
            value={confirmPassword}
            onChange={setConfirmPassword}
            disabled={submitting}
            autoComplete="new-password"
            required
          />

          {/* Validación de coincidencia */}
          {confirmPassword && (
            <p
              className={`text-xs flex items-center gap-1 ${
                passwordsMatch ? "text-green-600" : "text-red-600"
              }`}
            >
              {passwordsMatch ? (
                <>
                  <Check className="h-3 w-3" />
                  Las contraseñas coinciden
                </>
              ) : (
                <>
                  <X className="h-3 w-3" />
                  Las contraseñas no coinciden
                </>
              )}
            </p>
          )}

          {/* Indicadores de fortaleza */}
          {password && (
            <div className="space-y-3">
              <PasswordStrengthIndicator strength={strength} />
              <PasswordRequirements validations={validations} />
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={submitting || !isValid || !passwordsMatch}
          >
            {submitting ? "Creando cuenta..." : "Crear cuenta"}
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

        <GoogleSignInButton
          onClick={handleGoogleAuth}
          disabled={submitting}
          // text="Registrarse con Google"
        />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
