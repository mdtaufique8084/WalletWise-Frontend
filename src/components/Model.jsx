import React from "react";
import { X } from "lucide-react";

const Model = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black/40 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[90vh] animate-fadeIn">
                {/* Modal Card */}
                <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 overflow-y-auto max-h-[65vh]">
                        {children}
                    </div>

                    
                </div>
            </div>
        </div>
    );
};

export default Model;
