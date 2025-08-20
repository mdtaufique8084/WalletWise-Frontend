import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import UserHook from "../hooks/userHook";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndPoints";
import toast from "react-hot-toast";
import IncomeList from "../components/IncomeList";
import Model from "../components/Model";
import AddIncomeForm from "../components/AddIncomeForm";

const Income = () => {
  UserHook();
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openIncomeModel, setOpenIncomeModel] = useState(false);
  const [categories, setCategories] = useState([]);

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

  //FETCH INCOME CATEGORIES 
  const fetchIncomeCategories = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_CATEGORY_BY_TYPE("income"));
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      console.log("failed to fetch income categories", error);
      toast.error("Failed to fetch income categories");
    }
  };


  // SAVE THE INCOME DETAILS
  const handleAddIncome = async (income) => {
    const { name, amount, date, icon, categoryId } = income;
    if (!name.trim()) return toast.error("Name is required");
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return toast.error("Valid amount should be a number greater than 0");
    }
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // remove time
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      return toast.error("Date cannot be in the future");
    }
    if (!icon) return toast.error("Icon is required");
    if (!categoryId) return toast.error("Category is required");

    try {
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_INCOME, {
        name,
        amount: Number(amount),
        date,
        icon,
        categoryId
      });
      if (response.status === 201) {
        setOpenIncomeModel(false);
        toast.success("Income added successfully");
        fetchIncomeDetails();
        fetchIncomeCategories();
      }
    } catch (error) {
      console.log("failed to add income", error);
      toast.error("Failed to add income");
    }
  }

  useEffect(() => {
    fetchIncomeDetails();
    fetchIncomeCategories();
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
            onClick={() => setOpenIncomeModel(true)}
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

        {/* Add Income Model  */}
        <Model
          isOpen={openIncomeModel}
          onClose={() => setOpenIncomeModel(false)}
          title="Add Income"
        >
          <AddIncomeForm
            categories={categories}
            onAddIncome={(income) => handleAddIncome(income)} />
        </Model>
      </div>
    </Dashboard>
  );
};

export default Income;
