import { Routes, Route, Navigate } from "react-router-dom";
import SignUpMUI from "../pages/SignUpMUI";
import Landing from "../pages/Landing";
import Login from "../pages/Login";

import Protect from "../components/Protect";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Dashboard from "../pages/Dashboard";
import EventPage from "../pages/EventPage";
import CreateEvent from "../pages/CreateEvent";
import ProfilePage from "../pages/Profile";
import ValidateUser from "../components/validation/ValidateUser";

const PublicRoutes = () => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <Routes>
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUpMUI />} />
        <Route element={<Protect />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="events">
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="create" element={<CreateEvent />} />
            <Route path=":id" element={<EventPage />} />
          </Route>
          <Route path="users">
            <Route index element={<Navigate to="/dashboard" />} />
            <Route element={<ValidateUser />}>
              <Route path=':id' element={<ProfilePage />} />
            </Route>
          </Route>
          <Route path="profile" element={<>Profile Page</>} />
          <Route path="settings" element={<>Settings</>} />
        </Route>
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default PublicRoutes;
