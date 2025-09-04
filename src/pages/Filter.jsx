import React, { useState } from "react";
import Dashboard from "../components/Dashboard";
import UserHook from "../hooks/userHook";
import { Search, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndPoints";

const Filter = () => {
  UserHook();

  const [type, setType] = useState("income");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        type,
        startDate: startDate || null,
        endDate: endDate || null,
        keyword: keyword || null,
        sortField,
        sortOrder,
      };

      const response = await axiosConfig.post(
        API_ENDPOINTS.APPLY_FILTERS,
        payload
      );

      if (response.data && response.data.length > 0) {
        setTransactions(response.data);
        toast.success("Transactions loaded successfully");
      } else {
        setTransactions([]);
        toast("No transactions found", { icon: "ℹ️" });
      }
    } catch (error) {
      console.error("Error fetching transactions", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error loading transactions");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setType("income");
    setStartDate("");
    setEndDate("");
    setKeyword("");
    setSortField("date");
    setSortOrder("asc");
    setTransactions([]);
  };

  return (
    <Dashboard>
      <div className="my-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h1 className="text-2xl font-bold text-gray-900">
            Filter Transactions
          </h1>
        </div>

        {/* Filter Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
          <div className="mb-5">
            <h5 className="text-lg font-semibold text-gray-800">
              Select Filters
            </h5>
            <p className="text-sm text-gray-500">
              Narrow down transactions using these options
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSearch} className="flex flex-col gap-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {/* Type */}
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  id="type"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-500 transition"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label
                  htmlFor="startdate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Date
                </label>
                <input
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  id="startdate"
                  type="date"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>

              {/* End Date */}
              <div>
                <label
                  htmlFor="enddate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  End Date
                </label>
                <input
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  id="enddate"
                  type="date"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>

              {/* Sort Field */}
              <div>
                <label
                  htmlFor="sortfield"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sort By
                </label>
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  id="sortfield"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-500 transition"
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="category">Category</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label
                  htmlFor="sortorder"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  id="sortorder"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-500 transition"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>

            {/* Row 2 - Search */}
            <div className="flex justify-center gap-3">
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                id="keyword"
                type="text"
                placeholder="Search transactions..."
                className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-500 transition"
              />
              <button
                type="submit"
                className="h-10 w-10 flex items-center justify-center rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition shadow-sm"
              >
                <Search size={18} />
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition shadow-sm"
              >
                <X size={18} />
              </button>
            </div>
          </form>
        </div>

        {/* Results Section in Box */}
        <div className="mt-8 bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
          <h5 className="text-lg font-semibold text-gray-800 mb-4">
            Transactions
          </h5>

          {loading ? (
            <div className="flex justify-center items-center py-10 text-purple-600">
              <Loader2 className="animate-spin" size={28} />
              <span className="ml-3">Loading transactions...</span>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl shadow-inner">
              <p className="text-lg font-medium">No transactions found</p>
              <p className="text-sm">
                Try adjusting your filters or search term.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {transactions.map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-purple-50 transition-colors duration-200 rounded-lg"
                >
                  {/* Left Side */}
                  <div className="flex items-center gap-4">
                    <img
                      src={txn.icon}
                      alt={txn.categoryName}
                      className="w-10 h-10 rounded-full border border-gray-200"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">{txn.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(txn.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Right Side - Amount */}
                  <span
                    className={`font-semibold text-lg ${
                      txn.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ₹{txn.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Dashboard>
  );
};

export default Filter;
