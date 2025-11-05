export const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return "Rp0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatCurrencyWithDecimal = (amount) => {
  if (amount == null || isNaN(amount)) return "Rp0,00";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

