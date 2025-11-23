import { useMemo } from "react";

export type PasswordStrength = "weak" | "medium" | "strong";

export interface PasswordValidations {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export function usePasswordValidation(password: string) {
  const validations = useMemo((): PasswordValidations => {
    return {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }, [password]);

  const strength = useMemo((): PasswordStrength => {
    const validCount = Object.values(validations).filter(Boolean).length;
    if (validCount <= 2) return "weak";
    if (validCount <= 4) return "medium";
    return "strong";
  }, [validations]);

  const isValid = useMemo(() => {
    return (
      validations.minLength &&
      validations.hasUpperCase &&
      validations.hasLowerCase &&
      validations.hasNumber
    );
  }, [validations]);

  return {
    validations,
    strength,
    isValid,
  };
}
