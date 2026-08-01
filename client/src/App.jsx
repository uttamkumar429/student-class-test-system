import { Toaster } from "sonner";

import AppRoutes from "./routes/AppRoutes";

import { TOAST_CONFIG } from "./lib/toast/toastConfig";

import "./styles/toast.css";

function App() {
  return (
    <>
      <Toaster {...TOAST_CONFIG} />

      <AppRoutes />
    </>
  );
}

export default App;