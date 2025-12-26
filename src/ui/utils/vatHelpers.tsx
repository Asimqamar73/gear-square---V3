import { round2 } from "./Round2";

export const calculateAmountExVat = (withVatTotal: number) => {
  const amountInclVat = Number(withVatTotal);
  if (!amountInclVat || amountInclVat <= 0) return 0;
  return round2(amountInclVat / 1.05);
};

export const calculateVatAmount = (withVatTotal: number) => {
  const amountInclVat = Number(withVatTotal);
  if (!amountInclVat || amountInclVat <= 0) return 0;
  return round2(amountInclVat - amountInclVat / 1.05);
};
