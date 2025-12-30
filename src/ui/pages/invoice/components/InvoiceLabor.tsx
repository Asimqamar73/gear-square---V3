// import { Button } from "../../../../components/ui/button";
// import { Trash, Plus } from "lucide-react";
// import { round2 } from "../../../utils/Round2";
// import { useEffect } from "react";
// import { calculateAmountExVat, calculateVatAmount } from "../../../utils/vatHelpers";

// interface LabourCharge {
//   title: string;
//   description: string;
//   inclVatTotal: number;
//   exclVatTotal: number;
//   vat: number;
// }

// interface LabourChargesProps {
//   labourItems: LabourCharge[];
//   setLabourItems: any;
//   setTotalLaborCost: any;
//   setLaborItemsTotalVat: any;
//   deleteLaborItem: any;
// }

// const LabourCharges = ({
//   labourItems,
//   setLabourItems,
//   setTotalLaborCost,
//   deleteLaborItem,
//   setLaborItemsTotalVat,
// }: LabourChargesProps) => {
//   // Calculate totals whenever labourItems changes
//   useEffect(() => {
//     const totalLabourAmount = labourItems.reduce(
//       (acc, item) => acc + (Number(item.inclVatTotal) || 0),
//       0
//     );

//     // Calculate total VAT from all labor items
//     // const totalVat = labourItems.reduce(
//     //   (acc, item) => acc + calculateVatAmount(Number(item.inclVatTotal) || 0),
//     //   0
//     // );
//     setTotalLaborCost(totalLabourAmount);
//     setLaborItemsTotalVat(round2(calculateVatAmount(totalLabourAmount)));
//   }, [labourItems, setTotalLaborCost, setLaborItemsTotalVat]);

//   const addNewLabour = () => {
//     setLabourItems([
//       ...labourItems,
//       { title: "", description: "", inclVatTotal: 0, exclVatTotal: 0, vat: 0 },
//     ]);
//   };

//   const handleChange = (idx: number, field: keyof LabourCharge, value: string | number) => {
//     const updated = [...labourItems];

//     if (field === "inclVatTotal") {
//       const numValue = Number(value) || 0;
//       updated[idx].inclVatTotal = numValue;
//       updated[idx].vat = calculateVatAmount(numValue);
//       updated[idx].exclVatTotal = calculateAmountExVat(numValue);
//     } else {
//       //@ts-ignore
//       updated[idx][field] = value;
//     }

//     setLabourItems(updated);
//   };

//   const totalLabourAmount = labourItems.reduce(
//     (acc, item) => acc + (Number(item.inclVatTotal) || 0),
//     0
//   );

//   return (
//     <div className="p-6 bg-white rounded-2xl flex flex-col gap-6 border border-gray-300 shadow-sm">
//       <h2 className="text-xl font-semibold text-gray-800">Labour Charges</h2>

//       {labourItems.map((item, idx) => (
//         <div
//           key={idx}
//           className="grid grid-cols-3 md:flex-row md:items-end gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm"
//         >
//           <div className="flex flex-col gap-2">
//             {/* Labour Type */}
//             <div className="flex flex-col flex-1">
//               <label className="text-sm font-medium text-gray-600 mb-1">Title</label>
//               <input
//                 type="text"
//                 value={item.title}
//                 onChange={(e) => handleChange(idx, "title", e.target.value)}
//                 className="border rounded-sm p-2 bg-teal-50/30 border-gray-400 placeholder:text-gray-400"
//                 placeholder="Enter title"
//                 required
//               />
//             </div>
//             {/* Amount */}
//             <div className="flex flex-col">
//               <div className="flex justify-between items-center mb-1">
//                 <label className="text-sm font-medium text-gray-600">
//                   Amount (AED) - Incl. VAT
//                 </label>
//                 <div className="flex gap-1">
//                   <span className="text-xs font-medium text-gray-500 px-2.5 py-1 bg-gray-100 rounded-full">
//                     Excl vat: {calculateAmountExVat(Number(item.inclVatTotal)).toFixed(2)}
//                   </span>

//                   <span className="text-xs font-medium text-gray-500 px-2.5 py-1 bg-gray-100 rounded-full">
//                     VAT: {calculateVatAmount(Number(item.inclVatTotal)).toFixed(2)}
//                   </span>
//                 </div>
//               </div>
//               <input
//                 type="number"
//                 min="0"
//                 step="0.01"
//                 value={item.inclVatTotal || ""}
//                 onChange={(e) => handleChange(idx, "inclVatTotal", e.target.value)}
//                 className="border rounded-sm p-2 bg-teal-50/30 border-gray-400 placeholder:text-gray-400"
//                 placeholder="0.00"
//                 required
//               />
//             </div>
//           </div>

//           {/* Description */}
//           <div className="col-span-2 flex gap-2 h-full">
//             <div className="flex flex-col flex-1">
//               <label className="text-sm font-medium text-gray-600 mb-1">Details</label>
//               <textarea
//                 value={item.description}
//                 onChange={(e) => handleChange(idx, "description", e.target.value)}
//                 className="border rounded-sm p-2 bg-teal-50/30 border-gray-400 placeholder:text-gray-400"
//                 placeholder="Optional details..."
//                 rows={4}
//               />
//             </div>
//             {/* Delete Button */}
//             <div className="flex items-center">
//               <Button
//                 variant="outline"
//                 className="bg-red-400 text-white h-11 w-11"
//                 onClick={() => deleteLaborItem(idx)}
//               >
//                 <Trash />
//               </Button>
//             </div>
//           </div>
//         </div>
//       ))}

//       {/* Add Button */}
//       <Button
//         variant="outline"
//         className="w-fit items-center gap-2 px-6 py-3 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium shadow-sm hover:shadow-md"
//         onClick={addNewLabour}
//       >
//         <Plus className="w-4 h-4" />
//         Add Labour Charge
//       </Button>

//       {/* Total Amount */}
//       <div className="text-right font-semibold text-gray-800">
//           <span>Total Labor cost: </span>
//         AED {calculateAmountExVat(totalLabourAmount)}
//       </div>
//     </div>
//   );
// };

// export default LabourCharges;

import { Button } from "../../../../components/ui/button";
import { Combobox } from "../../../../components/ComboBox";
import { Trash, Plus } from "lucide-react";
import { round2 } from "../../../utils/Round2";
import { useEffect } from "react";
import { calculateAmountExVat, calculateVatAmount } from "../../../utils/vatHelpers";

interface LabourCharge {
  labourType: any; // stores the selected labour type object
  description: string;
  inclVatTotal: number;
  exclVatTotal: number;
  vat: number;
}

interface LabourChargesProps {
  labourItems: LabourCharge[];
  setLabourItems: any;
  setTotalLaborCost: any;
  setLaborItemsTotalVat: any;
  deleteLaborItem: any;
  labourTypes: any[]; // array of labour type objects with id and name
}

const LabourCharges = ({
  labourItems,
  setLabourItems,
  setTotalLaborCost,
  deleteLaborItem,
  setLaborItemsTotalVat,
  labourTypes,
}: LabourChargesProps) => {

  // Calculate totals whenever labourItems changes
  useEffect(() => {
    const totalLabourAmount = labourItems.reduce(
      (acc, item) => acc + (Number(item.inclVatTotal) || 0),
      0
    );
    setTotalLaborCost(totalLabourAmount);
    setLaborItemsTotalVat(round2(calculateVatAmount(totalLabourAmount)));
  }, [labourItems, setTotalLaborCost, setLaborItemsTotalVat]);

  const addNewLabour = () => {
    setLabourItems([
      ...labourItems,
      { description: "", inclVatTotal: 0, exclVatTotal: 0, vat: 0, labourType: null },
    ]);
  };

  const handleLabourTypeChange = (value: string, idx: number) => {
    const updated = [...labourItems];
    const selectedLabourType = labourTypes.find((type) => type.id === value);
    updated[idx].labourType = selectedLabourType || null;
    setLabourItems(updated);
  };

  const handleChange = (idx: number, field: keyof LabourCharge, value: string | number) => {
    const updated = [...labourItems];

    if (field === "inclVatTotal") {
      const numValue = Number(value) || 0;
      updated[idx].inclVatTotal = numValue;
      updated[idx].vat = calculateVatAmount(numValue);
      updated[idx].exclVatTotal = calculateAmountExVat(numValue);
    } else {
      //@ts-ignore
      updated[idx][field] = value;
    }

    setLabourItems(updated);
  };

  const totalLabourAmount = labourItems.reduce(
    (acc, item) => acc + (Number(item.inclVatTotal) || 0),
    0
  );

  return (
    <div className="p-6 bg-white rounded-2xl flex flex-col gap-6 border border-gray-300 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">Labour Charges</h2>

      {labourItems.map((item, idx) => (
        <div
          key={idx}
          className="grid grid-cols-3 md:flex-row md:items-end gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex flex-col gap-2">
            {/* Labour Type - Now with Combobox */}
            <div className="flex flex-col flex-1">
              <label className="text-sm font-medium text-gray-600 mb-1">Labour Type</label>
              {/* <Combobox
                data={labourTypes.filter(
                  (type: any) =>
                    // show labour type only if it's not selected in other items OR it's the current item's type
                    !labourItems.some((i: any) => i.laborType?.id === type.id)
                )}
                emptyMessage="No labour type found"
                placeholder="Search labour type"
                value={item.labourType?.id || ""}
                handleProductChange={(value: string) => handleLabourTypeChange(value, idx)}
                item={item}
                itemIdx={idx}
              /> */}

              <Combobox
                data={labourTypes.filter(
                  (type: any) =>
                    !labourItems.some((i: any) => i.labourType?.id === type.id && i !== item)
                )}
                emptyMessage="No labour type found"
                placeholder="Search labour type"
                value={item.labourType?.id || ""}
                handleProductChange={(value: string) => handleLabourTypeChange(value, idx)}
                item={item}
                itemIdx={idx}
                type="labour" // Add this prop
              />
            </div>
            {/* Amount */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-600">
                  Amount (AED) - Incl. VAT
                </label>
                <div className="flex gap-1">
                  <span className="text-xs font-medium text-gray-500 px-2.5 py-1 bg-gray-100 rounded-full">
                    Excl vat: {calculateAmountExVat(Number(item.inclVatTotal)).toFixed(2)}
                  </span>

                  <span className="text-xs font-medium text-gray-500 px-2.5 py-1 bg-gray-100 rounded-full">
                    VAT: {calculateVatAmount(Number(item.inclVatTotal)).toFixed(2)}
                  </span>
                </div>
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={item.inclVatTotal || ""}
                onChange={(e) => handleChange(idx, "inclVatTotal", e.target.value)}
                className="border rounded-sm p-2 bg-teal-50/30 border-gray-400 placeholder:text-gray-400"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="col-span-2 flex gap-2 h-full">
            <div className="flex flex-col flex-1">
              <label className="text-sm font-medium text-gray-600 mb-1">Details</label>
              <textarea
                value={item.description}
                onChange={(e) => handleChange(idx, "description", e.target.value)}
                className="border rounded-sm p-2 bg-teal-50/30 border-gray-400 placeholder:text-gray-400"
                placeholder="Optional details..."
                rows={4}
              />
            </div>
            {/* Delete Button */}
            <div className="flex items-center">
              <Button
                variant="outline"
                className="bg-red-400 text-white h-11 w-11"
                onClick={() => deleteLaborItem(idx)}
              >
                <Trash />
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Add Button */}
      <Button
        variant="outline"
        className="w-fit items-center gap-2 px-6 py-3 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium shadow-sm hover:shadow-md"
        onClick={addNewLabour}
      >
        <Plus className="w-4 h-4" />
        Add Labour Charge
      </Button>

      {/* Total Amount */}
      <div className="text-right font-semibold text-gray-800">
        <span>Total Labor cost: </span>
        AED {calculateAmountExVat(totalLabourAmount)}
      </div>
    </div>
  );
};

export default LabourCharges;
