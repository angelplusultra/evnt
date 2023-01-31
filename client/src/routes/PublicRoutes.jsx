import { Routes, Route, Navigate, Link } from "react-router-dom";
import SignUpMUI from "../pages/SignUpMUI";
import Landing from "../pages/Landing";
import Login from "../pages/Login";

import Protect from "../components/Protect";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Dashboard from "../pages/Dashboard";
import EventPage from "../pages/EventPage";
import CreateEvent from "../pages/CreateEvent";
import ProfilePage from "../pages/Profile";
import ValidateUser from "../components/validation/ValidateUser";
import Gallery from "../pages/Gallery/Gallery";
import ArtistSignUp from "../pages/SignUp/ArtistSignUp";

const PublicRoutes = () => {
 return (
  <>
   <nav>
    <Link to="/profile">Profile</Link>
    <Link to="/dashboard">Dashboard</Link>
   </nav>
   <Routes>
    //* -----Public Routes------
    <Route index element={<Landing />} />
    <Route path="login" element={<Login />} />
    <Route path="signup">
     <Route index element={<SignUpMUI />} />
     <Route path="artist" element={<ArtistSignUp />} />
    </Route>
    // ------End of Public Routes--------- // --------ProtectedRoutes-----------
    <Route element={<Protect />}>
     <Route path="dashboard" element={<Dashboard />} />
     <Route path="profile">
      <Route index element={<ProfilePage />} />
      <Route path="gallery" element={<Gallery />} />
     </Route>
     <Route path="events">
      <Route index element={<Navigate to="/dashboard" />} />
      <Route path="create" element={<CreateEvent />} />
      <Route path=":id" element={<EventPage />} />
     </Route>
     <Route path="users">
      <Route index element={<Navigate to="/dashboard" />} />
      <Route element={<ValidateUser />}>
       <Route path=":id">
        <Route index element={<ProfilePage />} />
        <Route path="gallery" element={<Gallery />} />
       </Route>
      </Route>
     </Route>
     <Route path="profile" element={<>Profile Page</>} />
     <Route path="settings" element={<>Settings</>} />
    </Route>
    // ----End of Protected Routes-----
    <Route path="*" element={<h1>404</h1>} />
   </Routes>
   <ReactQueryDevtools initialIsOpen={false} />
  </>
 );
};

export default PublicRoutes;
