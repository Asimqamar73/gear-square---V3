// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import {
//   Search,
//   Loader2,
//   X,
//   ChevronDownIcon,
//   CloudSnow,
//   XSquareIcon,
//   XIcon,
//   Calendar1,
//   CalendarDaysIcon,
// } from "lucide-react";
// import InvoiceTable from "./components/Table";
// import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover";
// import { Button } from "../../../components/ui/button";
// import { Calendar } from "../../../components/ui/calendar";

// interface Invoice {
//   invoice_id: string | number;
//   vehicle_id: string | number;
//   vehicle_number: string;
//   chassis_number: string;
//   name: string;
//   phone_number: string;
//   company_name?: string;
//   company_phone_number?: string;
//   created_at: string;
//   bill_status: 0 | 1 | 2 | 3;
//   total: number;
//   amount_paid: number;
//   amount_due: number;
// }

// type TabType = "all" | "paid" | "partial" | "unpaid";

// const TAB_STATUS_MAP: Record<TabType, number | null> = {
//   all: null,
//   unpaid: 0,
//   partial: 1,
//   paid: 2,
// };

// const TAB_LABELS: Record<TabType, string> = {
//   all: "All",
//   paid: "Paid",
//   partial: "Partial Paid",
//   unpaid: "Unpaid",
// };

// const Invoices = () => {
//   const navigate = useNavigate();

//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [searchVal, setSearchVal] = useState("");
//   const [isSearchActive, setIsSearchActive] = useState(false);

//   const [activeTab, setActiveTab] = useState<TabType>("all");

//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalInvoices, setTotalInvoices] = useState(0);
//   const [open, setOpen] = useState(false);
//   const [date, setDate] = useState<Date | undefined>(undefined);

//   const totalPages = Math.ceil(totalInvoices / rowsPerPage);

//   useEffect(() => {
//     fetchInvoices();
//   }, [currentPage, rowsPerPage, activeTab]);

//   // const fetchInvoices = async (search = "") => {
//   //   setLoading(true);
//   //   try {
//   //     //@ts-ignore
//   //     const res = await window.electron.getInvoices({
//   //       limit: rowsPerPage,
//   //       offset: (currentPage - 1) * rowsPerPage,
//   //       search,
//   //       bill_status: TAB_STATUS_MAP[activeTab],
//   //     });

//   //     if (res?.success) {
//   //       setInvoices(res.response?.rows || []);
//   //       setTotalInvoices(res.response?.total || 0);
//   //     } else {
//   //       toast.error("Failed to load invoices.");
//   //     }
//   //   } catch {
//   //     toast.error("Something went wrong.");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const fetchInvoices = async (search = "", selectedDate?: Date) => {
//     setLoading(true);

//     try {
//       //@ts-ignore
//       const res = await window.electron.getInvoices({
//         limit: rowsPerPage,
//         offset: (currentPage - 1) * rowsPerPage,
//         search,
//         bill_status: TAB_STATUS_MAP[activeTab],

//         // 👇 date filter (optional)
//         date: selectedDate
//           ? selectedDate.toLocaleDateString().split("/").reverse().join("-")
//           : null,
//       });

//       if (res?.success) {
//         setInvoices(res.response?.rows || []);
//         setTotalInvoices(res.response?.total || 0);
//       } else {
//         toast.error("Failed to load invoices.");
//       }
//     } catch {
//       toast.error("Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleKeyDown = (e: any) => {
//     // Check if the pressed key is 'Enter'
//     if (e.key === "Enter") {
//       handleSearch();
//       // You can add further logic here, like form submission
//     }
//   };
//   const handleSearch = async () => {
//     if (!searchVal.trim()) {
//       toast.error("Please enter a vehicle or chassis number");
//       return;
//     }

//     setSearchLoading(true);
//     setCurrentPage(1);
//     setIsSearchActive(true);

//     try {
//       await fetchInvoices(searchVal.trim(), date);
//     } catch {
//       toast.error("Search failed.");
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   const handleClearSearch = () => {
//     setSearchVal("");
//     setIsSearchActive(false);
//     setCurrentPage(1);
//     fetchInvoices("", date);
//   };

//   const handleTabChange = (tab: TabType) => {
//     setDate(undefined);
//     setActiveTab(tab);
//     setCurrentPage(1);
//     setSearchVal("");

//     setIsSearchActive(false);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen">
//       <div className="py-8 px-8 max-w-[1400px] mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
//           <p className="text-sm text-gray-500">View and manage all invoices</p>
//           {/* Search */}
//           <div className="space-y-2 mt-5">
//             <div className="relative max-w-md">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

//               <input
//                 type="text"
//                 className="w-full pl-10 pr-24 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
//                 value={searchVal}
//                 placeholder="Search..."
//                 onKeyDown={handleKeyDown}
//                 onChange={(e) => setSearchVal(e.target.value)}
//                 // onKeyPress={handleKeyPress}
//               />

//               {searchLoading ? (
//                 <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
//               ) : (
//                 <button
//                   onClick={handleSearch}
//                   className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-md transition-colors"
//                 >
//                   Search
//                 </button>
//               )}
//             </div>

//             {isSearchActive && (
//               <button
//                 onClick={handleClearSearch}
//                 className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
//               >
//                 <X className="w-4 h-4" />
//                 Clear search
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Badge-style Tabs */}
//         <div className="flex justify-between items-center mb-6">
//           <div role="tablist" className="flex bg-gray-200 w-fit gap-1 p-1 rounded-lg text-sm">
//             {(Object.keys(TAB_LABELS) as TabType[]).map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => handleTabChange(tab)}
//                 className={`px-4 py-1 rounded-md font-medium transition-all duration-200 cursor-pointer hover:bg-gray-100 ${
//                   activeTab === tab
//                     ? "bg-white shadow text-gray-900"
//                     : "text-gray-700 hover:text-gray-900"
//                 }`}
//               >
//                 {TAB_LABELS[tab]}
//               </button>
//             ))}
//           </div>
//           <div className="flex flex-col gap-3">
//             {/* <label htmlFor="date" className="px-1">
//               Date of birth
//             </label> */}
//             <Popover open={open} onOpenChange={setOpen}>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="outline"
//                   id="date"
//                   className={`w-48 justify-between font-normal ${date ? "bg-emerald-50" : ""}`}
//                 >
//                   {date ? date.toLocaleDateString() : "Select date"}

//                   <CalendarDaysIcon />
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto overflow-hidden p-0 bg-gray-50 " align="end">
//                 <Calendar
//                   mode="single"
//                   selected={date}
//                   captionLayout="dropdown"
//                   onSelect={(date) => {
//                     setDate(date);
//                     setOpen(false);
//                     fetchInvoices(searchVal, date);
//                   }}
//                 />
//               </PopoverContent>
//             </Popover>
//           </div>
//         </div>

//         {/* Table */}
//         <InvoiceTable data={invoices} onViewInvoice={(id) => navigate(`/invoice/${id}`)} />

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between mt-6">
//             <div className="flex items-center gap-2">
//               <span className="text-sm text-gray-600">Rows per page:</span>
//               <select
//                 value={rowsPerPage}
//                 onChange={(e) => {
//                   setRowsPerPage(Number(e.target.value));
//                   setCurrentPage(1);
//                 }}
//                 className="px-2 py-1 border rounded-lg text-sm"
//               >
//                 {[5, 10, 20, 50].map((n) => (
//                   <option key={n} value={n}>
//                     {n}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1.5 border rounded-lg text-sm"
//               >
//                 Prev
//               </button>

//               <span className="text-sm text-gray-600">
//                 Page {currentPage} of {totalPages}
//               </span>

//               <button
//                 onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1.5 border rounded-lg text-sm"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Invoices;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Search, Loader2, X, CalendarDaysIcon } from "lucide-react";

import InvoiceTable from "./components/Table";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover";
import { Button } from "../../../components/ui/button";
import { Calendar } from "../../../components/ui/calendar";

interface Invoice {
  invoice_id: string | number;
  vehicle_id: string | number;
  vehicle_number: string;
  chassis_number: string;
  name: string;
  phone_number: string;
  company_name?: string;
  company_phone_number?: string;
  created_at: string;
  bill_status: 0 | 1 | 2 | 3;
  total: number;
  amount_paid: number;
  amount_due: number;
}

type TabType = "all" | "paid" | "partial" | "unpaid";

const TAB_STATUS_MAP: Record<TabType, number | null> = {
  all: null,
  unpaid: 0,
  partial: 1,
  paid: 2,
};

const TAB_LABELS: Record<TabType, string> = {
  all: "All",
  paid: "Paid",
  partial: "Partial Paid",
  unpaid: "Unpaid",
};

const Invoices = () => {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  //@ts-ignore
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const [searchVal, setSearchVal] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  const [activeTab, setActiveTab] = useState<TabType>("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalInvoices, setTotalInvoices] = useState(0);

  const [date, setDate] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);

  // const totalPages = Math.ceil(totalInvoices / rowsPerPage);

  /**
   * 🔁 SINGLE SOURCE OF TRUTH
   * Any change in filters or pagination triggers fetch
   */
  useEffect(() => {
    fetchInvoices(isSearchActive ? searchVal : "", date);
  }, [currentPage, rowsPerPage, activeTab, date]);

  const fetchInvoices = async (search = "", selectedDate?: Date) => {
    setLoading(true);

    try {
      //@ts-ignore
      const res = await window.electron.getInvoices({
        limit: rowsPerPage,
        offset: (currentPage - 1) * rowsPerPage,
        search,
        bill_status: TAB_STATUS_MAP[activeTab],
        date: selectedDate
          ? selectedDate.toLocaleDateString().split("/").reverse().join("-")
          : null,
      });

      if (res?.success) {
        setInvoices(res.response?.rows || []);
        setTotalInvoices(res.response?.total || 0);
      } else {
        toast.error("Failed to load invoices.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchVal.trim()) {
      toast.error("Please enter a vehicle or chassis number");
      return;
    }

    setSearchLoading(true);
    setCurrentPage(1);
    setIsSearchActive(true);

    try {
      await fetchInvoices(searchVal.trim(), date);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchVal("");
    setIsSearchActive(false);
    setCurrentPage(1);
    fetchInvoices("", date);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalInvoices / rowsPerPage);

  const renderPageButtons = () => {
    const pages: (number | string)[] = [];
    const delta = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        pages.push(i);
      } else if (i === currentPage - delta - 1 || i === currentPage + delta + 1) {
        pages.push("...");
      }
    }

    return pages.map((page, idx) => {
      if (page === "...") {
        return (
          <span
            key={idx}
            className="w-8 h-8 flex items-center justify-center text-gray-400 select-none"
          >
            ...
          </span>
        );
      }

      return (
        <button
          key={idx}
          onClick={() => setCurrentPage(Number(page))}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition ${
            currentPage === page
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          {page}
        </button>
      );
    });
  };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen">
      <div className="py-8 px-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500">View and manage all invoices</p>

          {/* Search */}
          <div className="space-y-2 mt-5">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="text"
                className="w-full pl-10 pr-24 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                value={searchVal}
                placeholder="Search..."
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />

              {searchLoading ? (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin" />
              ) : (
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-md"
                >
                  Search
                </button>
              )}
            </div>

            {isSearchActive && (
              <button
                onClick={handleClearSearch}
                className="inline-flex items-center gap-1.5 text-sm text-gray-600"
              >
                <X className="w-4 h-4" />
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* Tabs + Date */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex bg-gray-200 gap-1 p-1 rounded-lg text-sm">
            {(Object.keys(TAB_LABELS) as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-1 rounded-md font-medium transition-all duration-200 cursor-pointer hover:bg-gray-100 ${
                  activeTab === tab
                    ? "bg-white shadow text-gray-900"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {TAB_LABELS[tab]}
              </button>
            ))}
          </div>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-48 justify-between">
                {date ? date.toLocaleDateString() : "Select date"}
                <CalendarDaysIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0 bg-gray-50 " align="end">
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(d) => {
                  setDate(d);
                  setCurrentPage(1);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Table */}
        <InvoiceTable data={invoices} onViewInvoice={(id) => navigate(`/invoice/${id}`)} />

        {/* Pagination */}
        {totalInvoices > rowsPerPage && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> –{" "}
              <span className="font-medium">
                {Math.min(currentPage * rowsPerPage, totalInvoices)}
              </span>{" "}
              of <span className="font-medium">{totalInvoices}</span> invoices
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Prev
              </button>

              {renderPageButtons()}

              <button
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>

              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n} / page
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;
