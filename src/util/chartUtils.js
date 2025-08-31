// utils/chartUtils.js
export const prepareTransactionLineChartData = (transactions) => {
  if (!transactions || transactions.length === 0) return [];

  // Group transactions by formatted date
  const grouped = {};
  transactions.forEach((t) => {
    const formattedDate = new Date(t.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });

    if (!grouped[formattedDate]) {
      grouped[formattedDate] = {
        date: formattedDate,
        income: 0,
        sources: [],
      };
    }

    grouped[formattedDate].income += t.amount;
    grouped[formattedDate].sources.push({
      name: t.name,
      amount: t.amount,
    });
  });

  // Return sorted array by date
  return Object.values(grouped).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
};
