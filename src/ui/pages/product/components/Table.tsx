// import { Edit2, RefreshCcw, Package, AlertCircle, TrendingUp, Barcode } from "lucide-react";
// import { useState } from "react";

// interface Product {
//   id: string;
//   image: string;
//   name: string;
//   description?: string;
//   cost_price: number;
//   retail_price_incl_vat: number;
//   retail_price_excl_vat: number;
//   vat_amount: number;
//   quantity: number;
//   sku?: string;
//   part_number?: string;
// }

// interface ProductTableProps {
//   data: Product[];
//   onEdit: (productId: string) => void;
//   onRestock: (product: Product) => void;
// }

// const ProductsTable = ({ data, onEdit, onRestock }: ProductTableProps) => {
//   const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
//   const hasData = data && data.length > 0;

//   const getStockStatus = (quantity: number) => {
//     if (quantity === 0) {
//       return { label: "Out of Stock", color: "bg-red-100 text-red-700 border-red-200" };
//     } else if (quantity < 10) {
//       return { label: "Low Stock", color: "bg-amber-100 text-amber-700 border-amber-200" };
//     }
//     return { label: "In Stock", color: "bg-green-100 text-green-700 border-green-200" };
//   };

//   const calculateMargin = (cost: number, retail: number) => {
//     if (retail === 0) return 0;
//     return (((retail - cost) / retail) * 100).toFixed(1);
//   };

//   return (
//     <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="w-full min-w-full">
//           {!hasData && (
//             <caption className="py-8 text-center">
//               <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
//               <p className="text-gray-500 font-medium">No products in inventory</p>
//               <p className="text-gray-400 text-sm mt-1">Add products to start tracking inventory</p>
//             </caption>
//           )}
          
//           {hasData && (
//             <>
//               <thead>
//                 <tr className="bg-gradient-to-r from-gray-50 to-gray-200 border-b border-gray-200">
//                   <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     <div className="flex items-center gap-2">
//                       <Package className="w-4 h-4" />
//                       Product
//                     </div>
//                   </th>
//                   <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Description
//                   </th>
//                   <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Pricing (AED)
//                   </th>
//                   <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Stock Status
//                   </th>
//                   <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     <div className="flex items-center gap-2">
//                       <Barcode className="w-4 h-4" />
//                       Identifiers
//                     </div>
//                   </th>
//                   <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
              
//               <tbody>
//                 {data.map((product) => {
//                   const stockStatus = getStockStatus(product.quantity);
//                   const marginInclVAT = calculateMargin(product.cost_price, product.retail_price_incl_vat);
//                   const marginExclVAT = calculateMargin(product.cost_price, (product.retail_price_incl_vat - product.vat_amount));
                  
//                   return (
//                     <tr 
//                       key={product.id}
//                       className="border-b border-gray-100 hover:bg-blue-50/30 transition-all duration-150"
//                     >
//                       <td className="px-4 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
//                             {product.image ? (
//                               <img
//                                 src={`file://${product.image}`}
//                                 alt={product.name}
//                                 className="w-full h-full object-cover"
//                               />
//                             ) : (
//                               <Package className="w-6 h-6 text-gray-400" />
//                             )}
//                           </div>
//                           <div className="flex flex-col">
//                             <span className="font-semibold text-gray-900">{product.name}</span>
//                           </div>
//                         </div>
//                       </td>
                      
//                       <td className="px-4 py-4">
//                         {product.description ? (
//                           <span className="text-sm text-gray-600 line-clamp-2">{product.description}</span>
//                         ) : (
//                           <span className="text-gray-400 text-sm italic">No description</span>
//                         )}
//                       </td>
                      
//                       <td className="px-4 py-4">
//                         <div className="flex flex-col items-end gap-1">
//                           <div className="flex items-center gap-2">
//                             <span className="text-xs text-gray-500">Cost:</span>
//                             <span className="text-sm font-medium text-gray-700">{product.cost_price}</span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <span className="text-xs text-gray-500">Retail (vat incl):</span>
//                             <span className="text-sm font-semibold text-gray-900">{product.retail_price_incl_vat}</span>
//                           </div>
//                            <div className="flex items-center gap-2">
//                             <span className="text-xs text-gray-500">Retail (vat excl):</span>
//                             <span className="text-sm font-semibold text-gray-900">{product.retail_price_excl_vat}</span>
//                           </div>
//                             <div className="flex items-center gap-2">
//                             <span className="text-xs text-gray-500">VAT </span>
//                             <span className="text-sm font-semibold text-gray-900">{product.vat_amount}</span>
//                           </div>
//                           <div className="flex items-center gap-1 text-xs text-green-600">
//                             <TrendingUp className="w-3 h-3" />
//                             <span>{marginInclVAT}% margin - Incl vat</span>
//                           </div>
//                           <div className="flex items-center gap-1 text-xs text-green-600">
//                             <TrendingUp className="w-3 h-3" />
//                             <span>{marginExclVAT}% margin - Excl vat</span>
//                           </div>
                          
//                         </div>
//                       </td>
                      
//                       <td className="px-4 py-4">
//                         <div className="flex flex-col items-center gap-2">
//                           <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${stockStatus.color}`}>
//                             {product.quantity === 0 && <AlertCircle className="w-3 h-3 mr-1" />}
//                             {stockStatus.label}
//                           </span>
//                           <span className="text-lg font-bold text-gray-900">{product.quantity}</span>
//                           <span className="text-xs text-gray-500">units</span>
//                         </div>
//                       </td>
                      
//                       <td className="px-4 py-4">
//                         <div className="flex flex-col gap-1.5">
//                           {product.sku ? (
//                             <div className="flex flex-col">
//                               <span className="text-xs text-gray-500">SKU</span>
//                               <span className="text-sm font-mono text-gray-900">{product.sku}</span>
//                             </div>
//                           ) : (
//                             <span className="text-gray-400 text-xs italic">No SKU</span>
//                           )}
//                           {product.part_number ? (
//                             <div className="flex flex-col">
//                               <span className="text-xs text-gray-500">Part No.</span>
//                               <span className="text-sm font-mono text-gray-900">{product.part_number}</span>
//                             </div>
//                           ) : (
//                             <span className="text-gray-400 text-xs italic">No Part No.</span>
//                           )}
//                         </div>
//                       </td>
                      
//                       <td className="px-4 py-4">
//                         <div className="flex justify-center gap-1.5">
//                           <div className="relative">
//                             <button
//                               className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors text-gray-600"
//                               onClick={() => onEdit(product.id)}
//                               onMouseEnter={() => setHoveredTooltip(`edit-${product.id}`)}
//                               onMouseLeave={() => setHoveredTooltip(null)}
//                               aria-label="Edit product"
//                             >
//                               <Edit2 className="h-4 w-4" />
//                             </button>
//                             {hoveredTooltip === `edit-${product.id}` && (
//                               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10 shadow-lg">
//                                 Edit product
//                                 <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
//                               </div>
//                             )}
//                           </div>
                          
//                           <div className="relative">
//                             <button
//                               className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-green-50 hover:text-green-600 transition-colors text-gray-600"
//                               onClick={() => onRestock(product)}
//                               onMouseEnter={() => setHoveredTooltip(`restock-${product.id}`)}
//                               onMouseLeave={() => setHoveredTooltip(null)}
//                               aria-label="Restock product"
//                             >
//                               <RefreshCcw className="h-4 w-4" />
//                             </button>
//                             {hoveredTooltip === `restock-${product.id}` && (
//                               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10 shadow-lg">
//                                 Restock product
//                                 <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
              
//               <tfoot>
//                 <tr>
//                   <td colSpan={6} className="px-4 py-3 text-center text-sm text-gray-600 bg-gray-50 border-t border-gray-200">
//                     <div className="flex items-center justify-center gap-2">
//                       <Package className="w-4 h-4" />
//                       <span>Total products: {data.length}</span>
//                     </div>
//                   </td>
//                 </tr>
//               </tfoot>
//             </>
//           )}
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ProductsTable;


import { RefreshCcw, Package, AlertCircle, TrendingUp, Barcode, Edit } from "lucide-react";
import { useState } from "react";
import { round2 } from "../../../utils/Round2";

interface Product {
  id: string;
  image: string;
  name: string;
  description?: string;
  cost_price: number;
  retail_price_incl_vat: number;
  retail_price_excl_vat: number;
  vat_amount: number;
  quantity: number;
  sku?: string;
  part_number?: string;
}

interface ProductTableProps {
  data: Product[];
  onEdit: (productId: string) => void;
  onRestock: (product: Product) => void;
}

const ProductsTable = ({ data, onEdit, onRestock }: ProductTableProps) => {
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const hasData = data && data.length > 0;

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return { label: "Out of Stock", color: "bg-red-100 text-red-700 border-red-200" };
    } else if (quantity < 10) {
      return { label: "Low Stock", color: "bg-amber-100 text-amber-700 border-amber-200" };
    }
    return { label: "In Stock", color: "bg-green-100 text-green-700 border-green-200" };
  };

  const calculateMargin = (cost: number, retail: number) => {
    if (retail === 0) return 0;
    return (((retail - cost) / retail) * 100).toFixed(1);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          {!hasData && (
            <caption className="py-8 text-center">
              <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No products in inventory</p>
              <p className="text-gray-400 text-sm mt-1">Add products to start tracking inventory</p>
            </caption>
          )}
          
          {hasData && (
            <>
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-200 border-b border-gray-200">
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Product
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Pricing (AED)
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Stock Status
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Barcode className="w-4 h-4" />
                      Identifiers
                    </div>
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              
              <tbody>
                {data.map((product) => {
                  const stockStatus = getStockStatus(product.quantity);
                  const marginInclVAT = calculateMargin(product.cost_price, product.retail_price_incl_vat);
                  const marginExclVAT = calculateMargin(product.cost_price, (product.retail_price_incl_vat - product.vat_amount));
                  
                  return (
                    <tr 
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-blue-50/30 transition-all duration-150"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                            {product.image ? (
                              <img
                                src={`file://${product.image}`}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">{product.name}</span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-4 py-4">
                        {product.description ? (
                          <p className="text-sm text-gray-600 max-w-xs line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        ) : (
                          <span className="text-gray-300 text-sm">—</span>
                        )}
                      </td>
                      
                      <td className="px-4 py-4">
                        <div className="flex flex-col items-end gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-xs text-gray-500">Cost:</span>
                              <span className="text-sm font-medium text-gray-700">{round2(product.cost_price)}</span>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-xs text-gray-500">Retail:</span>
                              <span className="text-base font-bold text-gray-900">{round2(product.retail_price_incl_vat)}</span>
                            </div>
                          </div>
                          
                          <div className="relative group">
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-md border border-green-200 cursor-help">
                              <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-xs font-semibold text-green-700">{marginExclVAT}% margin</span>
                            </div>
                            
                            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-20">
                              <div className="bg-gray-900 text-white text-xs rounded-lg shadow-xl p-3 whitespace-nowrap">
                                <div className="space-y-1">
                                  <div className="flex justify-between gap-4">
                                    <span className="text-gray-300">Excl VAT:</span>
                                    <span className="font-semibold">{marginExclVAT}%</span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-gray-300">Incl VAT:</span>
                                    <span className="font-semibold">{marginInclVAT}%</span>
                                  </div>
                                  <div className="pt-1 mt-1 border-t border-gray-700">
                                    <div className="text-gray-400 text-xs">VAT: {round2(product.vat_amount)}</div>
                                  </div>
                                </div>
                                <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-4 py-4">
                        <div className="flex flex-col items-center gap-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${stockStatus.color}`}>
                            {product.quantity === 0 && <AlertCircle className="w-3 h-3 mr-1" />}
                            {stockStatus.label}
                          </span>
                          <span className="text-lg font-bold text-gray-900">{product.quantity}</span>
                          <span className="text-xs text-gray-500">units</span>
                        </div>
                      </td>
                      
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1.5 text-sm">
                          {product.sku && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-gray-400 uppercase">SKU:</span>
                              <span className="font-mono text-gray-900">{product.sku}</span>
                            </div>
                          )}
                          {product.part_number && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-gray-400 uppercase">P/N:</span>
                              <span className="font-mono text-gray-900">{product.part_number}</span>
                            </div>
                          )}
                          {!product.sku && !product.part_number && (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-1.5">
                          <div className="relative">
                            <button
                              className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors text-gray-600"
                              onClick={() => onEdit(product.id)}
                              onMouseEnter={() => setHoveredTooltip(`edit-${product.id}`)}
                              onMouseLeave={() => setHoveredTooltip(null)}
                              aria-label="Edit product"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            {hoveredTooltip === `edit-${product.id}` && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10 shadow-lg">
                                Edit
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                              </div>
                            )}
                          </div>
                          
                          <div className="relative">
                            <button
                              className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-green-50 hover:text-green-600 transition-colors text-gray-600"
                              onClick={() => onRestock(product)}
                              onMouseEnter={() => setHoveredTooltip(`restock-${product.id}`)}
                              onMouseLeave={() => setHoveredTooltip(null)}
                              aria-label="Restock product"
                            >
                              <RefreshCcw className="h-4 w-4" />
                            </button>
                            {hoveredTooltip === `restock-${product.id}` && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10 shadow-lg">
                                Restock
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              
              <tfoot>
                <tr>
                  <td colSpan={6} className="px-4 py-3 text-center text-sm text-gray-600 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2">
                      <Package className="w-4 h-4" />
                      <span>Total products: {data.length}</span>
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

export default ProductsTable;