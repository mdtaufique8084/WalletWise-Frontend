import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";
import {prepareTransactionLineChartData } from "../util/chartUtils";

const ExpenseOverView = ({ transactions }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setChartData([]);
      return;
    }

    //  Filter current month transactions
    const currentMonth = moment().month();
    const currentYear = moment().year();

    const filtered = transactions.filter((t) => {
      const d = moment(t.date);
      return d.month() === currentMonth && d.year() === currentYear;
    });

    setChartData(prepareTransactionLineChartData(filtered));
  }, [transactions]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Expense Trends ({moment().format("MMMM YYYY")})
        </h2>
        <p className="text-xs text-gray-500">
          Track your expenditure and expense this month
        </p>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="incomeColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f3f3" />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />

              {/* Custom Tooltip */}
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
                        <p className="text-sm text-gray-500">{label}</p>
                        <p className="font-semibold text-green-600 mb-2">
                          Total: ₹{item.income}
                        </p>
                        {item.sources?.map((s, i) => (
                          <p key={i} className="text-xs text-gray-600">
                            {s.name}: ₹{s.amount}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Area
                type="monotone"
                dataKey="income"
                stroke="#4CAF50"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#incomeColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex justify-center items-center h-72 text-gray-400">
          No expense data to display
        </div>
      )}
    </div>
  );
};

export default ExpenseOverView;
