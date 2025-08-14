import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import UserHook from "../hooks/userHook";
import { Plus } from "lucide-react";
import CategoryList from "../components/CategoryLIst";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndPoints";
import toast from "react-hot-toast";
import Model from "../components/Model";
import AddCategoryForm from "../components/AddCategoryForm";

const Category = () => {
  UserHook();

  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openAddCategoryModel, setAddOpenCategoryModel] = useState(false);
  const [openUpdateCategoryModel, setUpdateOpenCategoryModel] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
      if (!response.data || response.data.length === 0) {
        toast.error("No categories found", {
          style: {
            borderRadius: "8px",
            background: "#1f2937",
            color: "#fff",
            fontWeight: 500,
          },
          iconTheme: {
            primary: "#f87171",
            secondary: "#fff",
          },
        });
        return;
      }
      setCategoryData(response.data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch categories", {
        style: {
          borderRadius: "8px",
          background: "#1f2937",
          color: "#fff",
          fontWeight: 500,
        },
        iconTheme: {
          primary: "#f87171",
          secondary: "#fff",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (category) => {
    const { name, type, icon } = category
    if (!name.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    // TODO: Add API call to create category
    try
    {
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, {
        name,
        type,
        icon
      });
      if (response.status === 201) {
        toast.success("Category added successfully");
        setAddOpenCategoryModel(false);
        fetchCategories();
      }
    } 
    catch (error) {
      console.error("Error adding category:", error);
      toast.error(error.response?.data?.message || "Failed to add category");
    }
  }

  return (
    <Dashboard>
      <div className="my-8 mx-auto max-w-6xl px-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            All Categories
          </h2>
          <button
            onClick={() => setAddOpenCategoryModel(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>

        {/* Category List */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
          <CategoryList
            categories={categoryData}
            onEditCategories={setSelectedCategory}
            onDeleteCategories={fetchCategories}
          />
        </div>

        {/* TODO: Add modals */}
        <Model
          isOpen={openAddCategoryModel}
          onClose={() => setAddOpenCategoryModel(false)}
          title="Add Category"
        >
          <AddCategoryForm onAddCategory={handleAddCategory} />
        </Model>
      </div>
    </Dashboard>
  );
};

export default Category;
