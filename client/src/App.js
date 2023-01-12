import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import {UserContext} from "./context/userContext.js";


// * Routes:
// Public Routes
// /

function Views() {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   const token = localStorage.getItem("token");

   
    console.log("🚀 ~ file: App.js:18 ~ useEffect ~ token", token)

    if (token !== null) {
      setUser(token);
      
    } else {
      setUser(null);
      
    }
    setLoading(false);


  }, [user]);

if(loading) return <h1>Loading...</h1>


  return (
    <div className="App">
      <UserContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route path="*" element={<PublicRoutes />} />
      </Routes>
      <ToastContainer />
      </UserContext.Provider>
    </div>
  );
}

export default Views;
