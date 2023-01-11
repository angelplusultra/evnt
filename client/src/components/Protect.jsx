import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";

const Protect = ({ user }) => {
  if (user === null) {
    return <Navigate to="/login" />;
  } else {
    return <Outlet />;
  }
};

export default Protect;
