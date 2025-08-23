import { useState, useEffect } from "react";
import Input from "./Input";
import EmojiPickerPopUp from "./EmojiPickerPopUp";
import { LoaderCircle } from "lucide-react";

const AddIncomeForm = ({ categories = [], onAddIncome, isEditing, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [income, setIncome] = useState({
    name: "",
    amount: "",
    date: "",
    icon: "",
    categoryId: "",
  });

  // Patch data when editing
  useEffect(() => {
    if (isEditing && initialData) {
      setIncome({
        name: initialData.name || "",
        amount: initialData.amount ? String(initialData.amount) : "",
        date: initialData.date || "",
        icon: initialData.icon || "",
        categoryId: initialData.categoryId ? String(initialData.categoryId) : "",
      });
    }
  }, [isEditing, initialData]);

  //  Set default category only when adding
  useEffect(() => {
    if (!isEditing && categories.length > 0 && !income.categoryId) {
      setIncome((prev) => ({
        ...prev,
        categoryId: String(categories[0].id),
      }));
    }
  }, [categories, income.categoryId, isEditing]);

  const categoryOptions = categories.map((category) => ({
    value: String(category.id),
    label: category.name,
  }));

  const handleChange = (field, value) => {
    setIncome((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      await onAddIncome({
        ...income,
        amount: Number(income.amount), // send amount as number
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    income.name.trim() !== "" &&
    Number(income.amount) > 0 &&
    income.date.trim() !== "" &&
    income.icon.trim() !== "" &&
    income.categoryId.trim() !== "";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm p-6 space-y-4 border border-gray-100"
    >
      <EmojiPickerPopUp
        icon={income.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        value={income.name}
        onChange={(val) => handleChange("name", val)}
        label="Income Source"
        placeholder="e.g., Freelance, Salary, Bonus"
        type="text"
      />

      <Input
        value={income.categoryId}
        onChange={(val) => handleChange("categoryId", val)}
        label="Category"
        placeholder="Select a category"
        isSelect={true}
        options={categoryOptions}
      />

      <Input
        value={income.amount}
        onChange={(val) => handleChange("amount", val)}
        label="Amount"
        placeholder="e.g., 1000"
        type="number"
      />

      <Input
        value={income.date}
        onChange={(val) => handleChange("date", val)}
        label="Date"
        type="date"
      />

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={loading || !isFormValid}
          className={`px-5 py-2 rounded-lg text-white font-medium shadow-sm flex items-center justify-center gap-2 min-w-[160px]
            ${loading || !isFormValid
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 transition"}`}
        >
          {loading ? (
            <>
              <LoaderCircle className="w-5 h-5 animate-spin" />
              {isEditing ? "Updating..." : "Adding..."}
            </>
          ) : (
            <>{isEditing ? "Update Income" : "Add Income"}</>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddIncomeForm;
