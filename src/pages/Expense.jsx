import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import UserHook from "../hooks/userHook";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndPoints";
import toast from "react-hot-toast";
import moment from "moment";
import ExpenseOverView from "../components/ExpenseOverView";
import ExpenseList from "../components/ExpenseList";
import AddExpenseForm from "../components/AddExpenseForm";
import Model from "../components/Model";
import DeleteAlert from "../components/DeleteAlert";

const Expense = () => {
  UserHook();
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openExpenseModel, setOpenExpenseModel] = useState(false);
  const [openUpdateExpenseModel, setUpdateExpenseModel] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectExpense, setSelectedExpense] = useState(null);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  // fetch all expense records
  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_EXPENSE_DETAILS);
      if (response.status === 200) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log("failed to fetch expense details", error);
      toast.error("Failed to fetch expense details");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for expense
  const fetchExpenseCategories = async () => {
    try {
      const response = await axiosConfig.get(
        API_ENDPOINTS.GET_CATEGORY_BY_TYPE("expense")
      );
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      console.log("Failed to fetch expense categories", error);
      toast.error("Failed to fetch expense categories");
    }
  };

  // Add new Expense
  const handleAddExpense = async (expense) => {
    const { name, amount, date, icon, categoryId } = expense;
    if (!name.trim()) return toast.error("Name is required");
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return toast.error("Valid amount should be a number greater than 0");
    }
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      return toast.error("Date cannot be in the future");
    }
    if (!icon) return toast.error("Icon is required");
    if (!categoryId) return toast.error("Category is required");

    try {
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, {
        name,
        amount: Number(amount),
        date,
        icon,
        categoryId,
      });
      if (response.status === 201) {
        setOpenExpenseModel(false);
        toast.success("Expense added successfully");
        fetchExpenseDetails();
      }
    } catch (error) {
      console.log("failed to add expense", error);
      toast.error("Failed to add expense");
    }
  };

  // Open edit modal with selected expense
  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setUpdateExpenseModel(true);
  };

  // Update expense
  const handleUpdateExpense = async (expense) => {
    if (!selectExpense) return;

    const { name, amount, date, icon, categoryId } = expense;
    if (!name.trim()) return toast.error("Name is required");
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return toast.error("Valid amount should be a number greater than 0");
    }
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      return toast.error("Date cannot be in the future");
    }
    if (!icon) return toast.error("Icon is required");
    if (!categoryId) return toast.error("Category is required");

    try {
      const response = await axiosConfig.put(
        API_ENDPOINTS.UPDATE_EXPENSE(selectExpense.id),
        {
          name,
          amount: Number(amount),
          date,
          icon,
          categoryId,
        }
      );
      if (response.status === 200) {
        toast.success("Expense updated successfully");
        setUpdateExpenseModel(false);
        setSelectedExpense(null);
        fetchExpenseDetails();
      }
    } catch (error) {
      console.log("failed to update expense", error);
      toast.error("Failed to update expense");
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    try {
      const response = await axiosConfig.delete(
        API_ENDPOINTS.DELETE_EXPENSE(id)
      );
      if (response.status === 200) {
        setOpenDeleteAlert({ show: false, data: null });
        toast.success("Expense deleted successfully");
        fetchExpenseDetails();
      }
    } catch (error) {
      console.log("Error deleting the expense", error);
      toast.error(error.response?.data?.message || "Failed to delete expense");
    }
  };

  // Download expense details
  const handleDownloadExpenseDetails = async (onlyCurrentMonth = true) => {
    try {
      let url = API_ENDPOINTS.EXPENSE_DOWNLOAD;

      if (onlyCurrentMonth) {
        const month = moment().month() + 1; // moment month is 0-based
        const year = moment().year();
        url += `?month=${month}&year=${year}`;
      }

      const response = await axiosConfig.get(url, {
        responseType: "blob", // important for file download
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;

      const fileName = onlyCurrentMonth
        ? `expenses_${moment().format("MMMM_YYYY")}.xlsx`
        : "expenses_all.xlsx";

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      // cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success(`Expense Excel downloaded successfully`);
    } catch (error) {
      console.error("Error downloading expense excel:", error);
      toast.error("Failed to download expense details");
    }
  };

  // Email expense details
  const handleEmailExpenseDetails = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.EXPENSE_EMAIL);

      if (response.status === 200) {
        toast.success("Expense report emailed successfully ");
      } else {
        toast.error("Failed to send expense email");
      }
    } catch (error) {
      console.error("Error sending expense email:", error);
      toast.error("Error sending expense email");
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
    fetchExpenseCategories();
  }, []);

  return (
    <Dashboard>
      <div className="my-8 mx-auto max-w-6xl px-4 overflow-hidden sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Expense Overview</h1>
          <button
            onClick={() => setOpenExpenseModel(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            + Add Expense
          </button>
        </div>

        <ExpenseOverView transactions={expenseData} />

        {/* Content */}
        <div className="bg-white shadow rounded-2xl p-6 border border-gray-100">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : expenseData.length > 0 ? (
            <ExpenseList
              transactions={expenseData}
              onEditExpense={handleEditExpense}
              onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
              onDownload={handleDownloadExpenseDetails}
              onEmail={handleEmailExpenseDetails}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No expense records found.</p>
            </div>
          )}
        </div>

        {/* Add Expense Modal */}
        <Model
          isOpen={openExpenseModel}
          onClose={() => setOpenExpenseModel(false)}
          title="Add Expense"
        >
          <AddExpenseForm
            categories={categories}
            onAddExpense={handleAddExpense}
          />
        </Model>

        {/* Update Expense Modal */}
        <Model
          isOpen={openUpdateExpenseModel}
          onClose={() => {
            setUpdateExpenseModel(false);
            setSelectedExpense(null);
          }}
          title="Update Expense"
        >
          <AddExpenseForm
            categories={categories}
            onUpdateExpense={handleUpdateExpense}
            initialData={selectExpense}
            isEditing={true}
          />
        </Model>

        {/* Delete Expense Modal */}
        <Model
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content={"Are you sure you want to delete this expense?"}
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Model>
      </div>
    </Dashboard>
  );
};

export default Expense;
