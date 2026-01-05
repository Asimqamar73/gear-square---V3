import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface IPageHeader {
  title: string;
  subtitle?: string | null;
  navigation?: boolean;
  children?: any | undefined | null;
}

const PageHeader = ({ title, subtitle = "", navigation = true, children }: IPageHeader) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        {navigation && (
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-white hover:shadow-sm flex items-center justify-center transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-gray-700" />
          </button>
        )}

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default PageHeader;
