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
function DashboardLayout({ children }) {
  return (
    <div>
      <h1>DashboardLayout Working</h1>

      {children}
    </div>
  );
}

export default DashboardLayout;