import { Download, Mail, Loader2 } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard";
import moment from "moment";
import { useState } from "react";

const ExpenseList = ({ transactions, onDelete, onEditExpense, onDownload, onEmail }) => {
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);

  const handleDownload = async () => {
    setLoadingDownload(true);
    try {
      await onDownload();
    } finally {
      setLoadingDownload(false);
    }
  };

  const handleEmail = async () => {
    setLoadingEmail(true);
    try {
      await onEmail();
    } finally {
      setLoadingEmail(false);
    }
  };

  const currentMonth = moment().month();
  const currentYear = moment().year();

  const currentMonthTransactions = (transactions || []).filter((t) => {
    const d = moment(t.date);
    return d.month() === currentMonth && d.year() === currentYear;
  });

  return (
    <div className="bg-white shadow rounded-2xl p-6 border border-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h5 className="text-xl font-semibold text-gray-800">
          Expense Sources ({moment().format("MMMM YYYY")})
        </h5>

        <div className="flex items-center gap-2">
          {/* Email Button with Loader */}
          <button
            onClick={handleEmail}
            disabled={loadingEmail}
            className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg shadow-sm transition ${
              loadingEmail
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {loadingEmail ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Mail size={16} /> Email
              </>
            )}
          </button>

          {/* Download Button with Loader */}
          <button
            onClick={handleDownload}
            disabled={loadingDownload}
            className={`flex items-center gap-1 px-3 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition ${
              loadingDownload
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loadingDownload ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Downloading...
              </>
            ) : (
              <>
                <Download size={16} /> Download
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      {currentMonthTransactions && currentMonthTransactions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {currentMonthTransactions.map((transaction) => (
            <TransactionInfoCard
              key={transaction.id}
              icon={transaction.icon}
              name={transaction.name}
              date={moment(transaction.date).format("Do MMM YYYY")}
              amount={transaction.amount}
              type="expense"
              hideDeleteBtn={false}
              onEdit={() => onEditExpense(transaction)}
              onDelete={() => onDelete(transaction.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No expense records available for this month.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;