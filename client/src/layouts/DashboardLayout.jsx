// import Sidebar from "../components/layout/Sidebar";
// import Navbar from "../components/layout/Navbar";

// function DashboardLayout({ children }) {
//    console.log("StudentDashboard Mounted");
//   return (
//     <div className="flex min-h-screen bg-slate-100">

//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <div className="flex flex-1 flex-col">

//         {/* Top Navbar */}
//         <Navbar />

//         {/* Page Content */}
//         <main className="flex-1 p-8">
//           {children}
//         </main>

//       </div>

//     </div>
//   );
// }
import Sidebar from "../components/layout/Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="min-w-0 flex-1 overflow-y-auto p-6 lg:p-8">
        {children}
      </main>

    </div>
  );
}

export default DashboardLayout;