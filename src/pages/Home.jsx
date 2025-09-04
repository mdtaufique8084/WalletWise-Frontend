import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import UserHook from "../hooks/userHook";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndPoints";
import toast from "react-hot-toast";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

// ✅ Inline Card Components
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white border border-gray-200 rounded-2xl shadow-sm ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-4 border-b border-gray-200 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-gray-800 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const COLORS = ["#22c55e", "#ef4444"]; // green for income, red for expense

const Home = () => {
  UserHook();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await axiosConfig.get(API_ENDPOINTS.DASHBOARD_DATA);
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error loading dashboard:", error);
        toast.error(
          error.response?.data?.message ||
          "Failed to load dashboard. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Dashboard>
      <div className="my-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Welcome to the Dashboard
        </h1>

        {/* Loader */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* Dashboard Data */}
        {!loading && dashboardData && (
          <>
            {/* Top Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-800">
                    ₹{dashboardData.totalBalance}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Income</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">
                    ₹{dashboardData.totalIncome}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Expense</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-red-600">
                    ₹{dashboardData.totalExpense}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Latest Income & Expense */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {/* Latest Incomes */}
              <Card>
                <CardHeader>
                  <CardTitle>Latest Incomes</CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardData.latestIncomes?.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {dashboardData.latestIncomes.map((income) => (
                        <div
                          key={income.id}
                          className="flex justify-between items-center py-3 hover:bg-green-50 transition rounded-lg px-2"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={income.icon}
                              alt={income.name}
                              className="w-8 h-8"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {income.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(income.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold text-green-600">
                            ₹{income.amount}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No incomes found.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Latest Expenses */}
              <Card>
                <CardHeader>
                  <CardTitle>Latest Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardData.latestExpenses?.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {dashboardData.latestExpenses.map((expense) => (
                        <div
                          key={expense.id}
                          className="flex justify-between items-center py-3 hover:bg-red-50 transition rounded-lg px-2"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={expense.icon}
                              alt={expense.name}
                              className="w-8 h-8"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {expense.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(expense.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold text-red-600">
                            ₹{expense.amount}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No expenses found.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Charts + Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {/* Income vs Expense Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Income vs Expense</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Income", value: dashboardData.totalIncome },
                          { name: "Expense", value: dashboardData.totalExpense },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {[
                          {
                            name: "Income",
                            value: dashboardData.totalIncome,
                          },
                          {
                            name: "Expense",
                            value: dashboardData.totalExpense,
                          },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardData.recentTransactions?.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {dashboardData.recentTransactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="flex justify-between items-center py-3 hover:bg-gray-50 transition rounded-lg px-2"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={tx.icon}
                              alt={tx.name}
                              className="w-8 h-8"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {tx.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(tx.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <p
                            className={`font-semibold ${tx.type === "income"
                                ? "text-green-600"
                                : "text-red-600"
                              }`}
                          >
                            ₹{tx.amount}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No recent transactions found.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>


          </>
        )}
      </div>
    </Dashboard>
  );
};

export default Home;
