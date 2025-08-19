import { Download, Mail } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard";
import moment from "moment";

const IncomeList = ({ transactions, onDelete }) => {
  return (
    <div className="bg-white shadow rounded-2xl p-6 border border-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h5 className="text-xl font-semibold text-gray-800">
          Income Sources
        </h5>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition">
            <Mail size={16} /> Email
          </button>
          <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition">
            <Download size={16} /> Download
          </button>
        </div>
      </div>

      {/* Content */}
      {transactions && transactions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {transactions.map((transaction) => (
            <TransactionInfoCard
              key={transaction.id}
              icon={transaction.icon}
              name={transaction.name}
              date={moment(transaction.date).format("Do MMM YYYY")}
              amount={transaction.amount}
              type="income"
              hideDeleteBtn={false}
              onClick={() => onDelete(transaction.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No income records available.</p>
        </div>
      )}
    </div>
  );
};

export default IncomeList;
