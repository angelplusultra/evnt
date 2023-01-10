
import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";

// * Routes:
// Public Routes
// /

function Views() {
  return (
    <div className="App">
      <Routes>
        <Route path="*" element={<PublicRoutes />} />
      </Routes>
    </div>
  );
}

export default Views;
