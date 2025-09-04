import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
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


   // TODO: Get API call to fetch category
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

  // TODO: Add API call to create category
  const handleAddCategory = async (category) => {
    const { name, type, icon } = category
    if (!name.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    
    try {
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

  // TODO: PUT API call to update category
  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setUpdateOpenCategoryModel(true);
  }

  const handleUpdateCategory = async (updatedCategory) => {
    const { id, name, type, icon } = updatedCategory;
    if (!name.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    if (!id) {
      toast.error("Category ID is missing for update");
      return;
    }
    try {
      const response = await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(id), {
        name,
        type,
        icon
      });
      if (response.status === 200) {
        toast.success("Category updated successfully");
        setUpdateOpenCategoryModel(false);
        setSelectedCategory(null);
        fetchCategories();
      }
    }
    catch (error) {
      console.error("Error updating category:", error);
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  }


  // TODO: Delete API call to delete category

  const MySwal = withReactContent(Swal);

  const handleDeleteCategory = async (categoryId) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e11d48", // red
      cancelButtonColor: "#6b7280", // gray
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axiosConfig.delete(
        API_ENDPOINTS.DELETE_CATEGORY(categoryId)
      );
      if (response.status === 200) {
        toast.success("Category deleted successfully");
        fetchCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <Dashboard>
      <div className="my-8 mx-auto max-w-6xl px-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            All Categories
          </h1>
          <button
            onClick={() => setAddOpenCategoryModel(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
           + Add Category
          </button>
        </div>

        {/* Category List */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
          <CategoryList
            categories={categoryData}
            onEditCategories={handleEditCategory}
            onDeleteCategories={handleDeleteCategory}
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

        {/* TODO: Update modals */}
        <Model
          isOpen={openUpdateCategoryModel}
          onClose={() => {
            setUpdateOpenCategoryModel(false);
            setSelectedCategory(null);
          }}
          title="Update Category"
        >
          <AddCategoryForm
            onAddCategory={handleUpdateCategory}
            initialCategoryData={selectedCategory}
            isEditing={true}
          />
        </Model>
      </div>
    </Dashboard>
  );
};

export default Category;
