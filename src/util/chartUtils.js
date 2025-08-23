// utils/chartUtils.js

/**
 * Prepare line chart data for incomes
 * @param {Array} transactions - Array of income objects
 * Each income: { id, name, amount, date, icon, categoryId }
 * @returns {Array} e.g. [{ date: "20 Aug", income: 200 }]
 */
// util/chartUtils.js
export const prepareIncomeLineChartData = (transactions) => {
  if (!transactions || transactions.length === 0) return [];

  // Sort by date (ascending)
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Map into chart-friendly format
  return sorted.map((t) => ({
    date: new Date(t.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    }),
    income: t.amount,
    name: t.name, 
  }));
};
