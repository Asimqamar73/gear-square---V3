import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Wrench, FileText, ArrowLeft, Save } from "lucide-react";

interface LaborTypeDetails {
  title: string;
  description: string;
}

const AddLaborType = () => {
  const navigate = useNavigate();
  const initialState: LaborTypeDetails = {
    title: "",
    description: "",
  };

  const [details, setDetails] = useState<LaborTypeDetails>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!details.title.trim()) {
      toast.error("Labor type title is required", {
        position: "top-center",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      //@ts-ignore
      const user = JSON.parse(localStorage.getItem("gear-square-user"));
      //@ts-ignore
      const response = await window.electron.addLaborType({
        ...details,
      });

      if (response.success) {
        toast.success("Labor type added successfully", { position: "top-center" });
        navigate(`/labor-types/list`);
        setDetails(initialState);
      }
    } catch (error) {
      toast.error("Failed to add labor type. Please try again.", {
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen">
      <div className="py-8 px-8 max-w-[900px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-white hover:shadow-sm flex items-center justify-center transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Add New Labor Type</h1>
              <p className="text-sm text-gray-500 mt-0.5">Create a new labor type category</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Labor Type Information Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-gray-600" />
                <h2 className="text-base font-semibold text-gray-900">Labor Type Details</h2>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
                >
                  <Wrench className="w-4 h-4 text-gray-400" />
                  Title
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  onChange={handleChange}
                  value={details.title}
                  placeholder="e.g., Engine Repair, Oil Change, Brake Service"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4 text-gray-400" />
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
                  rows={6}
                  onChange={handleChange}
                  value={details.description}
                  placeholder="Enter a detailed description of this labor type..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Saving..." : "Save Labor Type"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLaborType;
