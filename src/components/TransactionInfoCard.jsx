import {
    UtensilsCrossed,
    Trash2,
    TrendingUp,
    TrendingDown,
    Edit2,
} from "lucide-react";
import React from "react";
import { formatIndianRupees } from "../util/formatIndianRupees";

const TransactionInfoCard = ({
    icon,
    name,
    date,
    amount,
    type,
    hideDeleteBtn,
    onDelete,
}) => {
    const isIncome = type === "income";

    return (
        <div className="group relative flex items-center justify-between gap-4 p-5 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-gray-200 transition">
            {/* Icon */}
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 flex-shrink-0">
                {icon ? (
                    <img src={icon} alt={name} className="w-8 h-8 object-contain" />
                ) : (
                    <UtensilsCrossed className="text-purple-500 w-6 h-6" />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-800 truncate">
                    {name}
                </h3>
                <p className="text-xs text-gray-500">{date}</p>
            </div>

            {!hideDeleteBtn && (
                <button
                    onClick={onDelete}
                    className="opacity-60 group-hover:opacity-100 transition text-gray-400 hover:text-purple-500 cursor-pointer"
                >
                    <Edit2 size={20} />
                </button>
            )}

            {/* Delete Button (if not hidden) */}
            {!hideDeleteBtn && (
                <button
                    onClick={onDelete}
                    className="opacity-60 group-hover:opacity-100 transition text-gray-400 hover:text-red-500 cursor-pointer"
                >
                    <Trash2 size={20} />
                </button>
            )}

            {/* Amount */}
            <div
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold ${isIncome ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                    }`}
            >
                {isIncome ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{formatIndianRupees(amount)}</span>
            </div>

        </div>
    );
};

export default TransactionInfoCard;
