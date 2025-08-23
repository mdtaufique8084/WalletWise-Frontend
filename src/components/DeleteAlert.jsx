import { LoaderCircle } from "lucide-react";
import { useState } from "react";

const DeleteAlert = ({ content, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Alert Message */}
      <p className="text-gray-700 text-sm">{content}</p>

      {/* Footer Buttons */}
      <div className="flex justify-end mt-6 gap-3">
        <button
          onClick={handleDelete}
          disabled={loading}
          type="button"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-sm min-w-[120px] justify-center
            ${loading
              ? "bg-red-400 cursor-not-allowed text-white"
              : "bg-red-600 hover:bg-red-700 text-white transition"}`}
        >
          {loading ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;
