export const getFirebaseAuthErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    "auth/email-already-in-use": "Este email ya está registrado",
    "auth/invalid-email": "Email inválido",
    "auth/operation-not-allowed": "Operación no permitida",
    "auth/weak-password": "La contraseña es muy débil",
    "auth/user-disabled": "Esta cuenta ha sido deshabilitada",
    "auth/user-not-found": "Email o contraseña incorrectos",
    "auth/wrong-password": "Email o contraseña incorrectos",
    "auth/invalid-credential": "Credenciales inválidas",
    "auth/too-many-requests": "Demasiados intentos fallidos. Intenta más tarde",
    "auth/network-request-failed": "Error de conexión. Verifica tu internet",
    "auth/popup-closed-by-user": "Ventana de autenticación cerrada",
    "auth/cancelled-popup-request": "Popup cancelado",
  };

  const errorMessageKey = Object.keys(errorMessages).find((key) =>
    errorCode.includes(key),
  );

  const message = errorMessageKey ? errorMessages[errorMessageKey] : undefined;

  return message ?? "Error al autenticar. Intenta nuevamente";
};
