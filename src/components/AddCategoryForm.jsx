import React, { useEffect, useState } from "react";
import Input from "./Input";
import EmojiPickerPopUp from "./EmojiPickerPopUp";
import { LoaderCircle } from "lucide-react";

const AddCategoryForm = ({ onAddCategory, initialCategoryData, isEditing }) => {
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState({
        name: "",
        type: "income", // lowercase to match option values
        icon: "",
    });

    const categoryTypeOptions = [
        { value: "income", label: "Income" },
        { value: "expense", label: "Expense" },
    ];

    useEffect(() => {
        if (isEditing && initialCategoryData) {
            setCategory(initialCategoryData);
        }
        else {
            setCategory({
                name: "",
                type: "income",
                icon: "",
            });
        }
    }, [isEditing, initialCategoryData]);

    const handleChange = (field, value) => {
        setCategory((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        try {
            e.preventDefault();
            await onAddCategory(category);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            {/* Icon Picker */}
            <EmojiPickerPopUp
                icon={category.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            {/* Name Input */}
            <Input
                value={category.name}
                onChange={(val) => handleChange("name", val)}
                label="Category Name"
                placeholder="e.g., FreeLance, Salary, Groceries"
                type="text"
            />

            {/* Type Select */}
            <Input
                value={category.type}
                onChange={(val) => handleChange("type", val)}
                label="Category Type"
                isSelect={true}
                options={categoryTypeOptions}
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
                        <>{isEditing ? "Update Category" : "Add Category"}</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AddCategoryForm;
