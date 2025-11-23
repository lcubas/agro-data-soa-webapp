import type { PasswordStrength } from "@/hooks/usePasswordValidation";

interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength;
}

const strengthConfig = {
  weak: {
    label: "Débil",
    color: "text-red-600",
    bgColor: "bg-red-500",
    width: "w-1/3",
  },
  medium: {
    label: "Media",
    color: "text-yellow-600",
    bgColor: "bg-yellow-500",
    width: "w-2/3",
  },
  strong: {
    label: "Fuerte",
    color: "text-green-600",
    bgColor: "bg-green-500",
    width: "w-full",
  },
};

export function PasswordStrengthIndicator({
  strength,
}: PasswordStrengthIndicatorProps) {
  const config = strengthConfig[strength];

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Fortaleza de contraseña</span>
        <span className={`font-medium ${config.color}`}>{config.label}</span>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${config.width} ${config.bgColor}`}
        />
      </div>
    </div>
  );
}
