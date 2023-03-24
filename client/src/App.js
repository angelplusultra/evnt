import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "./context/userContext.js";
import './index.css'
import {createTheme, ThemeProvider, colors, CssBaseline} from '@mui/material'
import { color } from "@mui/system";


const theme = createTheme({
 
})
function Views() {
  const { loading , isRefetching} = useUser();

  if (loading) return <h1>Loading...</h1>;

  return (
    <div className="App">
    <ThemeProvider theme={theme}>
    <CssBaseline />
      <Routes>
        <Route path="*" element={<PublicRoutes />} />
      </Routes>
    </ThemeProvider>
      <ToastContainer />
    </div>
  );
}

export default Views;
