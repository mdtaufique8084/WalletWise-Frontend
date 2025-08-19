import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import UserHook from "../hooks/userHook";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndPoints";
import toast from "react-hot-toast";
import IncomeList from "../components/IncomeList";

const Income = () => {
  UserHook();
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_INCOME_DETAILS);
      if (response.status === 200) {
        setIncomeData(response.data);
      }
    } catch (error) {
      console.log("failed to fetch income details", error);
      toast.error("Failed to fetch income details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
  }, []);

  return (
    <Dashboard>
      <div className="my-8 mx-auto max-w-6xl px-4 overflow-hidden sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Income Overview
          </h1>
          <button
            onClick={() => console.log("Open add income modal")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            + Add Income
          </button>
        </div>

        {/* Content */}
        <div className="bg-white shadow rounded-2xl p-6 border border-gray-100">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : incomeData.length > 0 ? (
            <IncomeList
              transactions={incomeData}
              onDelete={(id) => console.log("Delete transaction", id)}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No income records found.</p>
            </div>
          )}
        </div>
      </div>
    </Dashboard>
  );
};

export default Income;
