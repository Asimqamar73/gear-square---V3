import { useEffect, useState } from "react";
import InvoiceItem from "./components/InvoiceItem";
import AlertBox from "../../../components/AlertBox";
import PageHeader from "../../../components/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import {
  Building2,
  CalendarDays,
  Car,
  FileText,
  Hash,
  MapPin,
  Phone,
  RefreshCcw,
  User,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import LabourCharges from "./components/InvoiceLabor";
import { getStatusDot, paymentStatuses } from "../../utils/paymentHelpers";
import { round2 } from "../../utils/Round2";
import { calculateAmountExVat } from "../../utils/vatHelpers";

interface IItems {
  product: any;
  quantity: number;
  subtotal: number;
  inclVatTotal: number;
  itemVatTotal: number;
  id?: number;
  unitPriceInclVAT: number;
  costPrice: number;
}

interface LaborItem {
  title: string;
  description: string;
  inclVatTotal: number;
  exclVatTotal: number;
  vat: number;
  id?: number;
}

interface ICustomerInfo {
  id: number;
  name: string;
  company_name: string;
  address: string;
  email: string;
  vehicle_number: string;
  chassis_number: string;
  make: string;
  model: string;
  year: number;
  phone_number: string;
  company_phone_number: string;
  created_at: string;
  created_by: number;
  labor_cost: number;
  note: string;
  updated_at: string;
  updated_by: number;
}

export const EditCustomerInvoice = () => {
  const params = useParams();
  const navigate = useNavigate();

  const initialItemState: IItems = {
    product: null,
    quantity: 1,
    subtotal: 0,
    inclVatTotal: 0,
    itemVatTotal: 0,
    unitPriceInclVAT: 0,
    costPrice: 0,
  };

  const [products, setProducts] = useState([]);
  const [customerInfo, setCustomerInfo] = useState<ICustomerInfo | null>(null);
  const [totalBill, setTotalBill] = useState(0);
  const [totalVat, setTotalVat] = useState(0);
  const [laborCost, setLaborCost] = useState(0);
  const [laborItemsTotalVat, setLaborItemsTotalVat] = useState(0);
  const [discount, setDiscount] = useState<number | string>("");
  const [amountPaid, setAmountPaid] = useState<number | string>("");
  const [paymentStatus, setPaymentStatus] = useState<any>(0);
  const [laborItems, setLaborItems] = useState<LaborItem[]>([]);
  const [serviceNote, setServiceNote] = useState("");
  const [items, setItems] = useState<IItems[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track original data for comparison
  const [originalItems, setOriginalItems] = useState<any>([]);
  const [originalLaborItems, setOriginalLaborItems] = useState<any>([]);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      //@ts-ignore
      const { data } = await window.electron.getProducts();
      setProducts(data || []);
      fetchDetails(params.invoiceId, data);
    } catch (error) {
      toast.error("Failed to load products. Please try again.", {
        position: "top-center",
      });
      setLoading(false);
    }
  };

  const fetchDetails = async (id: any, products: any) => {
    try {
      //@ts-ignore
      const resp = await window.electron.getInvoiceDetails(id);

      setCustomerInfo(resp.service);
      setServiceNote(resp.service.note || "");
      setAmountPaid(resp.serviceBill.amount_paid);
      setDiscount(resp.serviceBill.discount);

      // Set labor items and calculate labor cost
      const laborItemsList =
        resp?.serviceLaborCostList.map((list: any) => {
          return {
            description: list.description,
            id: list.id,
            title: list.title,
            vat: list.labor_item_vat,
            exclVatTotal: list.subtotal_excl_vat,
            inclVatTotal: list.subtotal_incl_vat,
          };
        }) || [];
      setLaborItems(laborItemsList);

      // Calculate total labor cost (incl VAT) and VAT
      const totalLaborCostInclVat = round2(
        laborItemsList.reduce((acc: number, item: any) => acc + (Number(item.inclVatTotal) || 0), 0)
      );

      const laborItemsVAT = calculateVatAmount(totalLaborCostInclVat);
      setLaborCost(calculateAmountExVat(totalLaborCostInclVat));
      setLaborItemsTotalVat(laborItemsVAT);

      // Map service items to match the new structure
      const f_items = products
        .filter((p: any) => resp.serviceItems.some((i: any) => i.product_id === p.id))
        .map((p: any) => {
          const match = resp.serviceItems.find((i: any) => i.product_id === p.id);
          const inclVatTotal = match.quantity * p.retail_price_incl_vat;
          const exclVatTotal = calculateRetailExVat(inclVatTotal);
          const itemVatTotal = calculateVatAmount(inclVatTotal);

          return {
            product: p,
            quantity: match.quantity,
            subtotal: exclVatTotal,
            inclVatTotal,
            itemVatTotal,
            id: match.id,
          };
        });
      setItems(f_items);

      // Calculate totals for products
      // const productSubtotal = f_items.reduce((acc: number, item: any) => acc + item.subtotal, 0);
      // const productVat = f_items.reduce((acc: number, item: any) => acc + item.itemVatTotal, 0);
      const total = round2(f_items.reduce((acc: number, item: any) => acc + item.inclVatTotal, 0));
      const productSubtotal = calculateAmountExVat(total);
      const productVat = calculateVatAmount(total);
      setTotalBill(productSubtotal);
      setTotalVat(productVat);

      // Store original items for tracking changes
      setOriginalItems(JSON.parse(JSON.stringify(f_items)));
      setOriginalLaborItems(JSON.parse(JSON.stringify(laborItemsList)));
      // Calculate payment status
      // const totals = calculateTotalsHelper(
      //   productSubtotal,
      //   productVat,
      //   totalLaborCostInclVat,
      //   laborItemsVAT,
      //   resp.serviceBill.discount,
      //   resp.serviceBill.amount_paid
      // );
      setPaymentStatus(resp.serviceBill.bill_status);
    } catch (error) {
      toast.error("Failed to load invoice details. Please try again.", {
        position: "top-center",
      });
      navigate("/invoices");
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = (data: any, total: number) => {
    console.log(data);
    console.log(total);
    const paidAmount = Number(data) || 0;
    console.log(paidAmount < Number(total));
    if (paidAmount === 0) {
      return 0;
    } else if (paidAmount < Number(total)) {
      return 1;
    } else {
      return 2;
    }
  };

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

  const calculateTotalsHelper = (
    productSubtotal: number,
    productVat: number,
    //@ts-ignore
    laborCostValue: number,
    laborVat: number,
    discountValue: number | string,
    paidValue: number | string
  ) => {
    const laborCostInclVat = round2(
      laborItems.reduce((prev, curr) => prev + Number(curr.inclVatTotal), 0)
    );
    const laborCostExclVat = calculateAmountExVat(laborCostInclVat);
    console.log("productSubtotal", productSubtotal);
    console.log("productVat", productVat);
    const subtotal = productSubtotal + laborCostExclVat;
    const vatTotal = productVat + laborVat;
    const afterVat = subtotal + vatTotal;
    const validDiscount = Number(discountValue) || 0;
    const total = afterVat - validDiscount;
    const validPaidAmount = Number(paidValue) || 0;
    const remaining = total - validPaidAmount;

    return {
      laborVat,
      productVat,
      laborCostExclVat,
      vatTotal,
      subtotal,
      afterVat,
      validDiscount,
      total,
      validPaidAmount,
      remaining,
    };
  };

  const calculateTotals = () => {
    return calculateTotalsHelper(
      totalBill,
      totalVat,
      laborCost,
      laborItemsTotalVat,
      discount,
      amountPaid
    );
  };

  const addNewItem = () => {
    setItems([...items, initialItemState]);
  };

  const handleProductChange = (id: number, idx: number) => {
    const prod: any = products.find((product: any) => product.id === id);
    const updatedItem = [...items];
    const inclVatTotal = prod?.retail_price_incl_vat * items[idx].quantity;
    const exclVatTotal = calculateRetailExVat(inclVatTotal);
    const itemVatTotal = calculateVatAmount(inclVatTotal);

    updatedItem[idx] = {
      ...updatedItem[idx],
      product: prod,
      subtotal: exclVatTotal,
      inclVatTotal,
      itemVatTotal,
      unitPriceInclVAT: prod?.retail_price_incl_vat,
      costPrice: prod?.cost_price,
    };

    const total = round2(updatedItem.reduce((prev, curr) => prev + curr.inclVatTotal, 0));

    setTotalBill(calculateAmountExVat(total));
    setTotalVat(calculateVatAmount(total));
    setItems(updatedItem);
    const currentTotals = calculateTotals();
    const newTotal = inclVatTotal + currentTotals.total;

    setPaymentStatus(updatePaymentStatus(totals.validPaidAmount, newTotal));
  };

  const handleQuantityChange = (event: any, idx: number) => {
    const updatedItem = [...items];
    updatedItem[idx] = { ...updatedItem[idx], quantity: event.target.value };
    setItems(updatedItem);
  };

  const handleSubtotal = (idx: number) => {
    const updatedItem = [...items];
    const inclVatTotal = items[idx].quantity * items[idx]?.product?.retail_price_incl_vat;
    const exclVatTotal = calculateRetailExVat(inclVatTotal);
    const itemVatTotal = calculateVatAmount(inclVatTotal);

    updatedItem[idx] = {
      ...updatedItem[idx],
      subtotal: exclVatTotal,
      inclVatTotal,
      itemVatTotal,
      unitPriceInclVAT: items[idx]?.product?.retail_price_incl_vat,
    };

    const total = round2(updatedItem.reduce((prev, curr) => prev + curr.inclVatTotal, 0));

    setTotalBill(calculateAmountExVat(total));
    setTotalVat(calculateVatAmount(total));
    setItems(updatedItem);
    const currentTotals = calculateTotals();
    const newTotal = inclVatTotal + currentTotals.total;

    setPaymentStatus(updatePaymentStatus(totals.validPaidAmount, newTotal));
  };

  const deleteItem = (idx: number) => {
    const filteredItems = items.filter((_, itemIdx) => itemIdx !== idx);
    const total = round2(filteredItems.reduce((prev, curr) => prev + curr.inclVatTotal, 0));

    setTotalBill(calculateAmountExVat(total));
    setTotalVat(calculateVatAmount(total));
    setItems(filteredItems);
  };

  const deleteLaborItem = (idx: number) => {
    const filtered = laborItems.filter((_, i) => i !== idx);
    setLaborItems(filtered);

    // Recalculate labor cost and VAT after deletion
    const totalLabourAmount = round2(
      filtered.reduce((acc, item) => acc + (Number(item.inclVatTotal) || 0), 0)
    );
    // const totalVat = filtered.reduce(
    //   (acc, item) => acc + calculateVatAmount(Number(item.inclVatTotal) || 0),
    //   0
    // );

    setLaborCost(calculateAmountExVat(totalLabourAmount));
    setLaborItemsTotalVat(calculateVatAmount(totalLabourAmount));
    setPaymentStatus(updatePaymentStatus(totals.validPaidAmount, totals.total - totalLabourAmount));
  };

  const handleAmountPaid = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "" || !isNaN(Number(value))) {
      setAmountPaid(value);

      const numValue = Number(value) || 0;
      const currentTotals = calculateTotals();
      const newTotal = currentTotals.afterVat - currentTotals.validDiscount;

      if (numValue === 0) {
        setPaymentStatus(0);
      } else if (numValue > 0 && numValue < newTotal) {
        setPaymentStatus(1);
      } else if (numValue >= newTotal) {
        setPaymentStatus(2);
      }
    }
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || !isNaN(Number(value))) {
      setDiscount(value);

      const numAmountPaid = Number(amountPaid) || 0;
      if (numAmountPaid > 0) {
        const currentTotals = calculateTotals();
        const newDiscount = Number(value) || 0;
        const newTotal = currentTotals.afterVat - newDiscount;

        if (numAmountPaid === 0) {
          setPaymentStatus(0);
        } else if (numAmountPaid < newTotal) {
          setPaymentStatus(1);
        } else {
          setPaymentStatus(2);
        }
      }
    }
  };

  // Detect changes in items
  const detectItemChanges = () => {
    const changes = {
      added: [] as any[],
      updated: [] as any[],
      deleted: [] as any[],
    };

    // Find deleted items
    originalItems.forEach((originalItem: any) => {
      const stillExists = items.find((item: any) => item.id === originalItem.id);
      if (!stillExists && originalItem.id) {
        changes.deleted.push(originalItem.id);
      }
    });

    // Find added and updated items
    items.forEach((item: any) => {
      if (!item.product) return;

      if (!item.id) {
        changes.added.push({
          product_id: item.product.id,
          quantity: item.quantity,
          subtotal: item.subtotal,
          inclVatTotal: item.inclVatTotal,
          itemVatTotal: item.itemVatTotal,
          unitPriceInclVAT: item.unitPriceInclVAT,
          costPrice: item.costPrice,
        });
      } else {
        const original = originalItems.find((orig: any) => orig.id === item.id);
        if (original) {
          const hasChanged =
            original.quantity !== item.quantity ||
            original.subtotal !== item.subtotal ||
            original.product.id !== item.product.id;

          if (hasChanged) {
            changes.updated.push({
              id: item.id,
              product_id: item.product.id,
              quantity: item.quantity,
              subtotal: item.subtotal,
              inclVatTotal: item.inclVatTotal,
              itemVatTotal: item.itemVatTotal,
              unitPriceInclVAT: item.unitPriceInclVAT,
              costPrice: item.costPrice,
            });
          }
        }
      }
    });

    return changes;
  };

  // Detect changes in labor items
  const detectLaborChanges = () => {
    const changes = {
      added: [] as any[],
      updated: [] as any[],
      deleted: [] as any[],
    };

    // Find deleted labor items
    originalLaborItems.forEach((originalLabor: any) => {
      const stillExists = laborItems.find((labor: any) => labor.id === originalLabor.id);
      if (!stillExists && originalLabor.id) {
        changes.deleted.push(originalLabor.id);
      }
    });

    // Find added and updated labor items
    laborItems.forEach((labor: any) => {
      if (!labor.title) return;
      if (!labor.id) {
        changes.added.push({
          description: labor.description,
          title: labor.title,
          inclVatTotal: labor.inclVatTotal,
          exclVatTotal: labor.exclVatTotal,
          vat: labor.vat,
        });
      } else {
        const original = originalLaborItems.find((orig: any) => orig.id === labor.id);
        if (original) {
          const hasChanged =
            original.description !== labor.description ||
            original.inclVatTotal !== labor.inclVatTotal ||
            original.title !== labor.title;
          if (hasChanged) {
            changes.updated.push({
              id: labor.id,
              description: labor.description,
              title: labor.title,
              inclVatTotal: labor.inclVatTotal,
              exclVatTotal: labor.exclVatTotal,
              vat: labor.vat,
            });
          }
        }
      }
    });

    return changes;
  };

  const handleInvoiceUpdate = async () => {
    // Validation
    const hasNoItems = items.length === 0 || items.every((item) => item.product === null);
    const hasNoLaborItems =
      laborItems.length === 0 ||
      laborItems.every((labor) => !labor.title || labor.title.trim() === "");

    if (hasNoItems && hasNoLaborItems) {
      toast.error("Please add at least one service item or labor item", {
        position: "top-center",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const itemChanges = detectItemChanges();
      const laborChanges = detectLaborChanges();
      const totals = calculateTotals();

      // @ts-ignore
      const response = await window.electron.updateInvoice({
        service_id: params.invoiceId,
        items_changes: itemChanges,
        labor_changes: laborChanges,
        items,
        labor_item: laborItems,
        total: totals.total,
        subtotal: totals.subtotal,
        vat_amount: totals.vatTotal,
        discount_percentage: totals.validDiscount,
        discount_amount: totals.validDiscount,
        amount_paid: totals.validPaidAmount,
        labor_cost: calculateRetailExVat(Number(laborCost)),
        service_note: serviceNote,
        payment_status: updatePaymentStatus(totals.validPaidAmount, totals.total),
        //@ts-ignore
        updated_by: JSON.parse(localStorage.getItem("gear-square-user")).id,
      });

      if (response.success) {
        toast.success("Invoice updated successfully.", { position: "top-center" });
        navigate(`/invoice/${params.invoiceId}`);
      } else {
        toast.error("Failed to update invoice. Please try again.", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Invoice update error:", error);
      toast.error("Failed to update invoice. Please try again.", {
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
      setOpen(false);
    }
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading invoice details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-16 px-8">
        <div className="flex flex-col gap-2 mb-8">
          <PageHeader title="Edit invoice">
            <button
              onClick={() => setOpen(true)}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCcw className="w-4 h-4" />
                  Update
                </>
              )}
            </button>
            <AlertBox
              open={open}
              setOpen={setOpen}
              continueProcessHandler={handleInvoiceUpdate}
              text="Are you sure you want to update invoice?"
              subtext="Previous data will be overwritten with new invoice"
            />
          </PageHeader>

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Owner Details */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
                <User className="w-5 h-5 text-gray-600" />
                <h2 className="text-base font-semibold text-gray-900">Owner Details</h2>
              </div>
              <div className="space-y-3">
                {customerInfo?.name && (
                  <InfoRow
                    icon={<User className="w-4 h-4 text-gray-600" />}
                    value={customerInfo.name}
                    subValue={customerInfo.email}
                  />
                )}
                {customerInfo?.company_name && (
                  <InfoRow
                    icon={<Building2 className="w-4 h-4 text-gray-600" />}
                    value={customerInfo.company_name}
                    subValue={customerInfo.company_phone_number}
                  />
                )}
                {customerInfo?.phone_number && (
                  <InfoRow
                    icon={<Phone className="w-4 h-4 text-gray-600" />}
                    value={customerInfo.phone_number}
                  />
                )}
                {customerInfo?.address && (
                  <InfoRow
                    icon={<MapPin className="w-4 h-4 text-gray-600" />}
                    value={customerInfo.address}
                  />
                )}
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
                <Car className="w-5 h-5 text-gray-600" />
                <h2 className="text-base font-semibold text-gray-900">Vehicle Details</h2>
              </div>
              <div className="space-y-3">
                {customerInfo?.make && (
                  <InfoRow
                    icon={<Car className="w-4 h-4 text-gray-600" />}
                    value={`${customerInfo.make} ${customerInfo.model || ""}`}
                  />
                )}
                {customerInfo?.vehicle_number && (
                  <InfoRow
                    icon={<Hash className="w-4 h-4 text-gray-600" />}
                    value={customerInfo.vehicle_number}
                    subValue={`Chassis: ${customerInfo.chassis_number}`}
                  />
                )}
                {customerInfo?.year && (
                  <InfoRow
                    icon={<CalendarDays className="w-4 h-4 text-gray-600" />}
                    value={customerInfo.year.toString()}
                  />
                )}
              </div>
            </div>

            {/* Service Note */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
                <FileText className="w-5 h-5 text-gray-600" />
                <h2 className="text-base font-semibold text-gray-900">Service Note</h2>
              </div>
              <textarea
                value={serviceNote}
                onChange={(e) => setServiceNote(e.target.value)}
                placeholder="Add service notes or comments..."
                rows={7}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <InvoiceItem
            products={products}
            handleProductChange={handleProductChange}
            handleQuantityChange={handleQuantityChange}
            handleSubtotal={handleSubtotal}
            items={items}
            addNewItem={addNewItem}
            deleteItem={deleteItem}
            totalProductsAmount={totalBill}
          />

          <LabourCharges
            labourItems={laborItems}
            setLabourItems={setLaborItems}
            setTotalLaborCost={setLaborCost}
            deleteLaborItem={deleteLaborItem}
            setLaborItemsTotalVat={setLaborItemsTotalVat}
          />
        </div>
        <div className="flex justify-end mt-8">
          <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between gap-2 mb-5 pb-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Invoice Summary</h2>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${paymentStatuses[paymentStatus].color}`}
              >
                {getStatusDot(paymentStatus)}
                {paymentStatuses[paymentStatus].label}
              </span>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 space-y-2 p-2 rounded-xl border border-gray-300">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Products Subtotal</span>
                  <span className="font-medium text-gray-900">{totalBill} AED</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Labor Cost</span>
                  <span className="font-medium text-gray-900">{totals.laborCostExclVat} AED</span>
                </div>

                <div className="flex justify-between text-sm pt-3 border-t-2 border-gray-300">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="font-medium text-gray-900">{round2(totals.subtotal)} AED</span>
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded-xl space-y-2 border border-gray-300">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">VAT (5%) - Products</span>
                  <span className="font-medium text-gray-900">
                    {round2(totals.productVat)} AED
                  </span>
                </div>
                <div className="flex justify-between text-sm border-gray-300 ">
                  <span className="text-gray-600">VAT (5%) - Labor</span>
                  <span className="font-medium text-gray-900">
                    {round2(totals.laborVat)} AED
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t-2 border-gray-300">
                  <span className="text-gray-600 font-medium">VAT (5%)</span>
                  <span className="font-medium text-gray-900">
                    {round2(totals.vatTotal)} AED
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-sm pt-4 border-t-2 border-gray-300">
                <span className="text-gray-600">After VAT</span>
                <span className="font-medium text-gray-900">{round2(totals.afterVat)} AED</span>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="discount"
                  className="text-sm font-medium text-gray-700 flex justify-between"
                >
                  <span>Discount</span>
                </label>
                <input
                  type="text"
                  id="discount"
                  value={discount}
                  onChange={handleDiscountChange}
                  placeholder="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="amountPaid" className="text-sm font-medium text-gray-700">
                  Amount Paid
                </label>
                <input
                  type="text"
                  id="amountPaid"
                  value={amountPaid}
                  onChange={handleAmountPaid}
                  placeholder="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>

              <div className="pt-4 border-t border-gray-500 space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    {round2(totals.total)} AED
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remaining Balance</span>
                  <span
                    className={`font-semibold ${
                      totals.remaining > 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {round2(totals.remaining)} AED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({
  icon,
  value,
  subValue,
}: {
  icon: React.ReactNode;
  value: string | number;
  subValue?: string;
}) => (
  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors bg-gray-50 border border-gray-200/80">
    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 border border-orange-200">
      {icon}
    </div>
    <div className="flex-1 items-center h-full min-w-0">
      <p className="text-sm font-medium text-gray-900 break-words">{value}</p>
      {subValue && <p className="text-xs text-gray-500 mt-0.5">{subValue}</p>}
    </div>
  </div>
);
