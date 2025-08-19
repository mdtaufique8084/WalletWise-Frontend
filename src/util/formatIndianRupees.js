export function formatIndianRupees(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return "₹0";

  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0, // remove decimals
    maximumFractionDigits: 2, // keep 2 if needed
  });
}
