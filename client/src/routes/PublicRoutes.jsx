import { Routes, Route } from "react-router-dom";
import SignUp from "../pages/SignUp";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Protect from "../components/Protect";

const PublicRoutes = () => {
  return (
    <Routes>
      <Route index element={<Landing />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
      <Route element={<Protect />}>
            <Route path="dashboard" element={<>Dashboard</>} />
            <Route path="profile" element={<>Profile Page</>} />
            <Route path="settings" element={<>Settings</>} />
            <Route path="*" element={<h1>404</h1>} />
        </Route>    
        <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
};

export default PublicRoutes;
