import { Check, X } from "lucide-react";
import type { PasswordValidations } from "@/hooks/usePasswordValidation";

interface PasswordRequirementsProps {
  validations: PasswordValidations;
}

interface RequirementItemProps {
  valid: boolean;
  text: string;
  optional?: boolean;
}

function RequirementItem({
  valid,
  text,
  optional = false,
}: RequirementItemProps) {
  return (
    <div className="flex items-center gap-2">
      {valid ? (
        <Check className="h-3.5 w-3.5 text-green-600 shrink-0" />
      ) : (
        <X className="h-3.5 w-3.5 text-gray-400 shrink-0" />
      )}
      <span
        className={`${valid ? "text-green-700" : "text-muted-foreground"} ${
          optional ? "text-xs italic" : ""
        }`}
      >
        {text}
      </span>
    </div>
  );
}

export function PasswordRequirements({
  validations,
}: PasswordRequirementsProps) {
  return (
    <div className="space-y-1 text-xs">
      <RequirementItem
        valid={validations.minLength}
        text="Mínimo 8 caracteres"
      />
      <RequirementItem
        valid={validations.hasUpperCase}
        text="Una letra mayúscula"
      />
      <RequirementItem
        valid={validations.hasLowerCase}
        text="Una letra minúscula"
      />
      <RequirementItem valid={validations.hasNumber} text="Un número" />
      <RequirementItem
        valid={validations.hasSpecialChar}
        text="Un carácter especial (opcional pero recomendado)"
        optional
      />
    </div>
  );
}
