import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContext.js";
import { NavBar } from "./NavBar.jsx";

const Protect = () => {
  const { user, setUser } = useContext(UserContext);
  console.log(user);
  if (!user) {
    return <Navigate to="/login" />;
  } else {
    return (
      <>
       <Outlet />
      </>
    ) ;
  }
};

export default Protect;
