import { Routes, Route } from "react-router-dom";
import SignUpMUI from "../pages/SignUpMUI";
import Landing from "../pages/Landing";
import Login from "../pages/Login";

import Protect from "../components/Protect";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "../pages/Dashboard";
import EventPage from "../pages/EventPage";

const PublicRoutes = () => {
  return (
    <QueryClientProvider client={new QueryClient()}>
    <Routes>
      <Route index element={<Landing />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUpMUI />} />
      <Route element={<Protect />}>
            <Route path="dashboard" element={<Dashboard/>} />
            <Route path="event/:id" element={<EventPage />} />
            <Route path="profile" element={<>Profile Page</>} />
            <Route path="settings" element={<>Settings</>} />
        </Route>    
        <Route path="*" element={<h1>404</h1>} />
    </Routes>
    </QueryClientProvider>
  );
};

export default PublicRoutes;
