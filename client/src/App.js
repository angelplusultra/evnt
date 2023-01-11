import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

// * Routes:
// Public Routes
// /

function Views() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("token");
    if (user !== null) {
      setUser(user);
      console.log(user);
    } else {
      setUser(null);
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="*" element={<PublicRoutes user={user} />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default Views;
