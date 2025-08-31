import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import UserHook from "../hooks/userHook";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndPoints";
import toast from "react-hot-toast";
import IncomeList from "../components/IncomeList";
import Model from "../components/Model";
import AddIncomeForm from "../components/AddIncomeForm";
import DeleteAlert from "../components/DeleteAlert";
import IncomeOverView from "../components/IncomeOverView";
import moment from "moment";

const Income = () => {
  UserHook();
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openIncomeModel, setOpenIncomeModel] = useState(false);
  const [openUpdateIncomeModel, setUpdateIncomeModel] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectIncome, setSelectedIncome] = useState(null);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  // Fetch all income records
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

  // Fetch categories for income
  const fetchIncomeCategories = async () => {
    try {
      const response = await axiosConfig.get(
        API_ENDPOINTS.GET_CATEGORY_BY_TYPE("income")
      );
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      console.log("failed to fetch income categories", error);
      toast.error("Failed to fetch income categories");
    }
  };

  // Add new income
  const handleAddIncome = async (income) => {
    const { name, amount, date, icon, categoryId } = income;
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
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_INCOME, {
        name,
        amount: Number(amount),
        date,
        icon,
        categoryId,
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
  };

  // Open edit modal with selected income
  const handleEditIncome = (income) => {
    setSelectedIncome(income);
    setUpdateIncomeModel(true);
  };

  // Update income
  const handleUpdateIncome = async (income) => {
    if (!selectIncome) return;

    const { name, amount, date, icon, categoryId } = income;
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
        API_ENDPOINTS.UPDATE_INCOME(selectIncome.id),
        {
          name,
          amount: Number(amount),
          date,
          icon,
          categoryId,
        }
      );
      if (response.status === 200) {
        toast.success("Income updated successfully");
        setUpdateIncomeModel(false);
        setSelectedIncome(null);
        fetchIncomeDetails();
      }
    } catch (error) {
      console.log("failed to update income", error);
      toast.error("Failed to update income");
    }
  };

  // Delete income
  const deleteIncome = async (id) => {
    try {
      const response = await axiosConfig.delete(
        API_ENDPOINTS.DELETE_INCOME(id)
      );
      if (response.status === 200) {
        setOpenDeleteAlert({ show: false, data: null });
        toast.success("Income deleted successfully");
        fetchIncomeDetails();
      }
    } catch (error) {
      console.log("Error deleting the income", error);
      toast.error(error.response?.data?.message || "Failed to delete income");
    }
  };

  // Email and download logic

  const handleDownloadIncomeDetails = async (onlyCurrentMonth = true) => {
    try {
      let url = API_ENDPOINTS.INCOME_DOWNLOAD;

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
        ? `incomes_${moment().format("MMMM_YYYY")}.xlsx`
        : "incomes_all.xlsx";

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      // cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success(`Income Excel downloaded successfully`);
    } catch (error) {
      console.error("Error downloading income excel:", error);
      toast.error("Failed to download income details");
    }
  };


  // email send logic


  const handleEmailIncomeDetails = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.INCOME_EMAIL);

      if (response.status === 200) {
        toast.success("Income report emailed successfully ");
      } else {
        toast.error("Failed to send income email");
      }
    } catch (error) {
      console.error("Error sending income email:", error);
      toast.error("Error sending income email");
    }
  };


  useEffect(() => {
    fetchIncomeDetails();
    fetchIncomeCategories();
  }, []);

  return (
    <Dashboard>
      <div className="my-8 mx-auto max-w-6xl px-4 overflow-hidden sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Income Overview</h1>
          <button
            onClick={() => setOpenIncomeModel(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            + Add Income
          </button>
        </div>

        <IncomeOverView transactions={incomeData} />

        {/* Content */}
        <div className="bg-white shadow rounded-2xl p-6 border border-gray-100">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : incomeData.length > 0 ? (
            <IncomeList
              transactions={incomeData}
              onEditIncome={handleEditIncome}
              onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
              onDownload={handleDownloadIncomeDetails}
              onEmail={handleEmailIncomeDetails}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No income records found.</p>
            </div>
          )}
        </div>

        {/* Add Income Modal */}
        <Model
          isOpen={openIncomeModel}
          onClose={() => setOpenIncomeModel(false)}
          title="Add Income"
        >
          <AddIncomeForm
            categories={categories}
            onAddIncome={(income) => handleAddIncome(income)}
          />
        </Model>

        {/* Update Income Modal */}
        <Model
          isOpen={openUpdateIncomeModel}
          onClose={() => {
            setUpdateIncomeModel(false);
            setSelectedIncome(null);
          }}
          title="Update Income"
        >
          <AddIncomeForm
            categories={categories}
            onAddIncome={(income) => handleUpdateIncome(income)}
            initialData={selectIncome}
            isEditing={true}
          />
        </Model>

        {/* Delete Income Modal */}
        <Model
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content={"Are you sure you want to delete this income?"}
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Model>
      </div>
    </Dashboard>
  );
};

export default Income;
