export const round2 = (value: number): number => {
  // Multiply by 100, round to nearest integer, then divide by 100
  return Math.round((value + Number.EPSILON) * 100) / 100;
};