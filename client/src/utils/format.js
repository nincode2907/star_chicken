export const formatCurrency = (money) => {
  const config = {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  };
  const formated = new Intl.NumberFormat("vi-VN", config).format(money);
  return formated;
};
