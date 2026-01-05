import { Combobox } from "../../../../components/ComboBox";
import { Button } from "../../../../components/ui/button";
import { Plus, Trash } from "lucide-react";
import { round2 } from "../../../utils/Round2";

const calculateRetailExVat = (withVatTotal: number) => {
  const retailIncl = Number(withVatTotal);
  if (!retailIncl || retailIncl <= 0) return 0;
  return round2(retailIncl / 1.05);
};

const calculateVatAmount = (withVatTotal: number) => {
  const retailIncl = Number(withVatTotal);
  if (!retailIncl || retailIncl <= 0) return 0;
  return round2(retailIncl - retailIncl / 1.05);
};
const InvoiceItem = ({
  products,
  handleSubtotal,
  handleQuantityChange,
  handleProductChange,
  items,
  addNewItem,
  deleteItem,
  totalProductsAmount,
}: any) => {
  return (
    <div className="p-4 bg-white rounded-xl flex flex-col gap-4 border  border-gray-300 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">Service items</h2>
      {items.map((item: any, idx: number) => (
        <div className="flex items-end gap-4" key={idx}>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="name" className="text-sm text-gray-500 font-medium">
              Name
            </label>
            {/* 
            <Combobox
              data={products.filter(
                (p: any) =>
                  // show product only if it's not selected in other items OR it's the current item's product
                  !items.some((i: any) => i.product?.id === p.id && i !== item)
              )}
              emptyMessage="No product found"
              placeholder="Search product"
              value={item.product?.id || ""}
              handleProductChange={handleProductChange}
              item={item}
              itemIdx={idx}
            /> */}
            <Combobox
              data={products.filter(
                (p: any) =>
                  // show product only if it's not selected in other items OR it's the current item's product
                  !items.some((i: any) => i.product?.id === p.id && i !== item)
              )}
              emptyMessage="No product found"
              placeholder="Search product"
              value={item.product?.id || ""}
              handleProductChange={handleProductChange}
              item={item}
              itemIdx={idx}
              // type="product" is default, no need to specify
            />
          </div>
          <div className="flex flex-col gap-1 grow">
            <label htmlFor="name" className="text-sm font-medium text-gray-500">
              Unit price
            </label>
            <input
              type="text"
              name="basePrice"
              id="basePrice"
              className="border rounded-sm p-2 bg-teal-50/30 border-gray-400 disabled:bg-gray-100"
              //   onChange={onMutate}
              value={item.product?.retail_price_excl_vat || 0}
              required
              disabled
              placeholder="00.00"
            />
          </div>
          <div className="flex flex-col justify-center gap-1 grow relative">
            <label htmlFor="name" className="text-sm font-medium text-gray-500">
              Quantity
            </label>

            <input
              type="text"
              name="quantity"
              id="quantity"
              className="border rounded-sm p-2 bg-teal-50/30 border-gray-400 placeholder:text-gray-400"
              //   onChange={onMutate}
              value={item.quantity}
              onBlur={() => handleSubtotal(idx)}
              onChange={(e) => handleQuantityChange(e, idx)}
              required
              placeholder="5"
            />
          </div>

          <div className="flex flex-col gap-1 grow">
            <label htmlFor="name" className="text-sm font-medium text-gray-500">
              Subtotal
            </label>
            <input
              type="number"
              name="subtotal"
              id="subtotal"
              className="border rounded-sm p-2 bg-teal-50/30 border-gray-400 disabled:bg-gray-100"
              //   onChange={onMutate}
              // value={selectedProduct?.barcode}
              value={calculateRetailExVat(item.inclVatTotal)}
              required
              disabled
              placeholder="00.00 AED"
            />
          </div>
          <div className="flex flex-col gap-1 grow">
            <label htmlFor="name" className="text-sm font-medium text-gray-500">
              VAT
            </label>
            <input
              type="number"
              name="subtotal"
              id="subtotal"
              className="border rounded-sm p-2 bg-teal-50/30 border-gray-400 disabled:bg-gray-100"
              value={calculateVatAmount(item.inclVatTotal)}
              required
              disabled
              placeholder="00.00 AED"
            />
          </div>
          <div className="flex flex-col gap-1 grow">
            <label htmlFor="name" className="text-sm font-medium text-gray-500">
              Amount (incl vat)
            </label>
            <input
              type="number"
              name="subtotal"
              id="subtotal"
              className="border rounded-sm p-2 bg-teal-50/30 border-gray-400 disabled:bg-gray-100"
              value={round2(item.inclVatTotal)}
              required
              disabled
              placeholder="00.00 AED"
            />
          </div>
          {/* <div className="flex flex-col gap-1 grow">
            <label htmlFor="name" className="text-sm text-gray-500">
              Profit (per unit)
            </label>
            <input
              type="number"
              name="profit"
              id="profit"
              className="border rounded-sm p-2 bg-teal-50/30 border-gray-400 disabled:bg-gray-100"
              //   onChange={onMutate}
              // value={selectedProduct?.barcode}
              value={item.product?.retail_price - item.product?.cost_price}
              required
              disabled
              placeholder="30 aed"
            />
          </div> */}
          {/* <div className="flex flex-col gap-1 grow">
            <label htmlFor="name" className="text-sm text-gray-500">
              Profit (per unit x quantity)
            </label>
            <input
              type="number"
              name="profit"
              id="profit"
              className="border rounded-sm p-2 bg-teal-50/30 border-gray-400 disabled:bg-gray-100"
              //   onChange={onMutate}
              // value={selectedProduct?.barcode}
              value={(
                (item.product?.retail_price_exclusive_vat - item.product?.cost_price) *
                item.quantity
              ).toFixed(2)}
              required
              disabled
              placeholder="00.00 AED"
            />
          </div> */}

          <Button
            variant="outline"
            className="bg-red-400 text-white h-11 w-11"
            onClick={() => deleteItem(idx)}
          >
            <Trash />
          </Button>
        </div>
      ))}
      <Button
        variant={"outline"}
        className="w-fit items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium transition-all shadow-sm hover:shadow-md"
        onClick={addNewItem}
      >
        <Plus className="w-4 h-4" />
        Add item
      </Button>
      <div className="text-right font-semibold text-gray-800">
        <span>Total cost: </span>
        AED {totalProductsAmount}
      </div>
    </div>
  );
};

export default InvoiceItem;
