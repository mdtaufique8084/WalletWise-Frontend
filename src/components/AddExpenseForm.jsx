import { useState, useEffect } from "react";
import Input from "./Input";
import EmojiPickerPopUp from "./EmojiPickerPopUp";
import { LoaderCircle } from "lucide-react";

const AddExpenseForm = ({
  categories = [],
  onAddExpense,
  onUpdateExpense,
  isEditing = false,
  initialData,
}) => {
  const [loading, setLoading] = useState(false);
  const [expense, setExpense] = useState({
    name: "",
    amount: "",
    date: "",
    icon: "",
    categoryId: "",
  });

  // Patch data when editing
  useEffect(() => {
    if (isEditing && initialData) {
      setExpense({
        name: initialData.name || "",
        amount: initialData.amount ? String(initialData.amount) : "",
        // Ensure date is in yyyy-MM-dd format for <input type="date" />
        date: initialData.date
          ? new Date(initialData.date).toISOString().split("T")[0]
          : "",
        icon: initialData.icon || "",
        categoryId: initialData.categoryId ? String(initialData.categoryId) : "",
      });
    }
  }, [isEditing, initialData]);

  // Set default category only when adding
  useEffect(() => {
    if (!isEditing && categories.length > 0 && !expense.categoryId) {
      setExpense((prev) => ({
        ...prev,
        categoryId: String(categories[0].id),
      }));
    }
  }, [categories, expense.categoryId, isEditing]);

  const categoryOptions = categories.map((category) => ({
    value: String(category.id),
    label: category.name,
  }));

  const handleChange = (field, value) => {
    setExpense((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid =
    expense.name.trim() !== "" &&
    Number(expense.amount) > 0 &&
    expense.date.trim() !== "" &&
    expense.icon.trim() !== "" &&
    expense.categoryId.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      const payload = {
        ...expense,
        amount: Number(expense.amount), // ensure numeric
      };

      if (isEditing && onUpdateExpense) {
        await onUpdateExpense(payload);
      } else if (onAddExpense) {
        await onAddExpense(payload);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm p-6 space-y-4 border border-gray-100"
    >
      <EmojiPickerPopUp
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        value={expense.name}
        onChange={(val) => handleChange("name", val)}
        label="Expense Source"
        placeholder="e.g., Dinner, Groceries, Fees"
        type="text"
      />

      <Input
        value={expense.categoryId}
        onChange={(val) => handleChange("categoryId", val)}
        label="Category"
        placeholder="Select a category"
        isSelect={true}
        options={categoryOptions}
      />

      <Input
        value={expense.amount}
        onChange={(val) => handleChange("amount", val)}
        label="Amount"
        placeholder="e.g., 1000"
        type="number"
      />

      <Input
        value={expense.date}
        onChange={(val) => handleChange("date", val)}
        label="Date"
        type="date"
      />

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={loading || !isFormValid}
          className={`px-5 py-2 rounded-lg text-white font-medium shadow-sm flex items-center justify-center gap-2 min-w-[160px]
            ${
              loading || !isFormValid
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 transition"
            }`}
        >
          {loading ? (
            <>
              <LoaderCircle className="w-5 h-5 animate-spin" />
              {isEditing ? "Updating..." : "Adding..."}
            </>
          ) : (
            <>{isEditing ? "Update Expense" : "Add Expense"}</>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddExpenseForm;
