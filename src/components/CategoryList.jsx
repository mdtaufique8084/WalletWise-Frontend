import { Pencil, Trash2, Edit3, Layers2 } from "lucide-react";
import React from "react";

const CategoryList = ({ categories, onEditCategories, onDeleteCategories }) => {
    return (
        <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-semibold text-gray-800">
                    Category Sources
                </h4>
            </div>

            {categories.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No categories found</p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="group flex flex-col items-center text-center p-5 rounded-lg border border-gray-100 shadow-sm bg-white hover:shadow-md hover:border-indigo-200 transition-all duration-200"
                        >
                            {/* Icon / Emoji */}
                            <div className="w-14 h-14 flex justify-center items-center text-xl text-gray-800 bg-gray-100 rounded-full mb-3">
                                {category.icon ? (
                                    <img
                                        src={category.icon}
                                        alt={category.name}
                                        className="w-6 h-6"
                                    />
                                ) : (
                                    <Layers2 className="text-purple-800" size={22} />
                                )}
                            </div>

                            {/* Category Name */}
                            <span className="font-medium text-gray-700 truncate">
                                {category.name}
                            </span>

                            {/* Category Type */}
                            <span className="text-sm text-gray-400">
                                {category.type}
                            </span>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 mt-4">
                                <button
                                    onClick={() => onEditCategories(category)}
                                    className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition cursor-pointer"
                                >
                                    <Edit3 size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => onDeleteCategories(category.id)}
                                    className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryList;
