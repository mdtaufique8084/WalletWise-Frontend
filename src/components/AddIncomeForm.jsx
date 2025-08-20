import EmojiPicker from "emoji-picker-react";
import { useState, useEffect } from "react";
import Input from "./Input";
import EmojiPickerPopUp from "./EmojiPickerPopUp";
import { LoaderCircle } from "lucide-react";

const AddIncomeForm = ({ categories, onAddIncome, isEditing }) => {
  const [loading, setLoading] = useState(false);
  const [income, setIncome] = useState({
    name: "",
    amount: "",
    date: "",
    icon: "",
    categoryId: "",
  });

  // Set default category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !income.categoryId) {
      setIncome((prev) => ({
        ...prev,
        categoryId: categories[0].id, // default to first category
      }));
    }
  }, [categories]);

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const handleChange = (field, value) => {
    setIncome((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAddIncome(income);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <EmojiPickerPopUp
        icon={income.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        value={income.name}
        onChange={(val) => handleChange("name", val)}
        label="Income Source"
        placeholder="e.g., FreeLance, Salary, Bonus"
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

      {/* Footer */}
      <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
        <button
          onClick={handleSubmit}
          type="button"
          disabled={loading}
          className={`px-4 py-2 rounded-lg bg-indigo-600 text-white 
                     hover:bg-indigo-700 transition font-medium shadow-sm 
                     flex items-center justify-center gap-2 min-w-[140px]`}
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
    </>
  );
};

export default AddIncomeForm;
