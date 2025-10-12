export const localeDate = (d: string | number | Date) =>
  new Date(d).toLocaleDateString();

export const toFixed = (n: number, digits = 3) => Number(n).toFixed(digits);
