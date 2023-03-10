import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "./context/userContext.js";
import './index.css'
function Views() {
  const { loading , isRefetching} = useUser();

  if (loading) return <h1>Loading...</h1>;

  return (
    <div className="App">
      <Routes>
        <Route path="*" element={<PublicRoutes />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default Views;
