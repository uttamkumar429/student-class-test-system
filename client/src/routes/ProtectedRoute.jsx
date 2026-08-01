// import { Navigate } from "react-router-dom";

// function ProtectedRoute({ children }) {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }

// export default ProtectedRoute;
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  console.log("========== ProtectedRoute ==========");
  console.log("Token:", token);
  console.log("Children:", children);

  if (!token) {
    console.log("Redirecting to Login");
    return <Navigate to="/" replace />;
  }

  console.log("Rendering Protected Component");

  return children;
}

export default ProtectedRoute;