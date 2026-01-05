// import { useState } from "react";
// import PageHeader from "../../../components/PageHeader";

// const Dashboard2 = () => {
//   const menubar = [
//     {
//       title: "Overall",
//     },
//     {
//       title: "Products",
//     },
//     {
//       title: "Labors",
//     },
//     {
//       title: "Expense",
//     },
//   ];
//   const [menuIndex, setMenuIndex] = useState(0);
//   return (
//     <div className="min-h-screen">
//       <div className="py-8 px-8 max-w-[1400px] mx-auto">
//         <PageHeader
//           title="Dashboard"
//           subtitle={"Overview of your business performance"}
//           navigation={false}
//         />
//         <div>
//           <ul className="flex bg-gray-200 w-fit gap-1 p-1 rounded-lg text-sm">
//             {menubar.map((el, idx) => (
//               <li
//                 className={`px-2 rounded-md ${menuIndex == idx ? "bg-white shadow" : ""}`}
//                 onClick={() => setMenuIndex(idx)}
//               >
//                 {el.title}
//               </li>
//             ))}
//             {/* <li className=" px-2 rounded-lg border border-zinc-500 bg-white">Overall</li>
//             <li className=" px-2 rounded-lg">Labors</li>
//             <li className=" px-2 rounded-lg">Expense</li> */}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard2;





import { useState } from "react";
import { Last7DaysChart } from "./components/7DaysBarChart";

// Mock PageHeader component since it's imported
const PageHeader = ({ title, subtitle }:{title:string,subtitle:string}) => (
  <div className="mb-6">
    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
    <p className="text-gray-600 mt-1">{subtitle}</p>
  </div>
);

const Dashboard2 = () => {
  const menubar = [
    { title: "Overall", id: "overall" },
    { title: "Products", id: "products" },
    { title: "Labors", id: "labors" },
    { title: "Expense", id: "expense" },
  ];
  
  const [menuIndex, setMenuIndex] = useState(0);

  const renderContent = () => {
    switch (menuIndex) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">$45,231</p>
              <p className="text-sm text-green-600 mt-2">↑ 12.5% from last month</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">1,234</p>
              <p className="text-sm text-green-600 mt-2">↑ 8.2% from last month</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Active Projects</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">48</p>
              <p className="text-sm text-gray-500 mt-2">6 pending review</p>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Products Overview</h3>
            <p className="text-gray-600">Product analytics and inventory management</p>
          </div>
        );
      case 2:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Labor Management</h3>
            <p className="text-gray-600">Employee hours and productivity tracking</p>
          </div>
        );
      case 3:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Tracking</h3>
            <p className="text-gray-600">Business expenses and budget analysis</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-8 max-w-[1400px] mx-auto">
        <PageHeader
          title="Dashboard"
          subtitle="Overview of your business performance"
        />
        
        <div className="mb-6">
          <div 
            role="tablist" 
            className="flex bg-gray-200 w-fit gap-1 p-1 rounded-lg text-sm"
          >
            {menubar.map((el, idx) => (
              <button
                key={el.id}
                role="tab"
                aria-selected={menuIndex === idx}
                aria-controls={`tabpanel-${el.id}`}
                id={`tab-${el.id}`}
                className={`px-4 py-1 rounded-md font-medium transition-all duration-200 cursor-pointer hover:bg-gray-100 ${
                  menuIndex === idx 
                    ? "bg-white shadow text-gray-900" 
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={() => setMenuIndex(idx)}
              >
                {el.title}
              </button>
            ))}
          </div>
        </div>

        <div
          role="tabpanel"
          id={`tabpanel-${menubar[menuIndex].id}`}
          aria-labelledby={`tab-${menubar[menuIndex].id}`}
          className="animate-fadeIn"
        >
          {renderContent()}
        </div>
        <Last7DaysChart/>
      </div>
    </div>
  );
};

export default Dashboard2;