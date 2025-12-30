import { Edit, Trash2, Wrench, FileText } from "lucide-react";
import { useState } from "react";

interface LaborType {
  id: string | number;
  title: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface LaborTypeTableProps {
  data: LaborType[];
  onEdit: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

const LaborTypeTable = ({ data, onEdit, onDelete }: LaborTypeTableProps) => {
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const hasData = data.length > 0;

  // const renderCellValue = (value: string | undefined, icon?: React.ReactNode) => {
  //   if (!value) {
  //     return <span className="text-gray-400 text-sm italic">Not provided</span>;
  //   }
  //   return (
  //     <div className="flex items-center gap-2">
  //       {icon && <span className="text-gray-500">{icon}</span>}
  //       <span className="text-sm">{value}</span>
  //     </div>
  //   );
  // };

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {!hasData && (
            <caption className="py-8 text-center">
              <Wrench className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No labor types found</p>
              <p className="text-gray-400 text-sm mt-1">Start by adding your first labor type</p>
            </caption>
          )}

          {hasData && (
            <>
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-200 border-b border-gray-200">
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4" />
                      Title
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Description
                    </div>
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.map((laborType) => (
                  <tr
                    key={laborType.id}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{laborType.title}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {laborType.description ? (
                        <span className="text-sm text-gray-600">
                          {truncateText(laborType.description)}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm italic">No description</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-1.5">
                    

                        <div className="relative">
                          <button
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-amber-50 hover:text-amber-600 transition-colors text-gray-600"
                            onClick={() => onEdit(laborType.id)}
                            onMouseEnter={() => setHoveredTooltip(`edit-${laborType.id}`)}
                            onMouseLeave={() => setHoveredTooltip(null)}
                            aria-label="Edit labor type"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {hoveredTooltip === `edit-${laborType.id}` && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                              Edit labor type
                            </div>
                          )}
                        </div>

                        <div className="relative">
                          <button
                          disabled
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-red-50 hover:text-red-600 transition-colors text-gray-600 cursor-not-allowed"
                            onClick={() => onDelete(laborType.id)}
                            onMouseEnter={() => setHoveredTooltip(`delete-${laborType.id}`)}
                            onMouseLeave={() => setHoveredTooltip(null)}
                            aria-label="Delete labor type"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          {hoveredTooltip === `delete-${laborType.id}` && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                              Delete labor type
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-center text-sm text-gray-600 bg-gray-50"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Wrench className="w-4 h-4" />
                      <span>
                        Showing {data.length} labor type{data.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </>
          )}
        </table>
      </div>
    </div>
  );
};

export default LaborTypeTable;