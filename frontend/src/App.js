// module-imports
import React from "react";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";

//Pages
import Auth from "./pages/Auth";
import Editor from "./pages/Editor";
import AboutUS from "./pages/AboutUs";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import PageNotFound from "./pages/PageNotFound";
import ProtectedRoute from "./pages/ProtectedRoute";

//components
// import TextEditor from "./components/TextEditor";

//css
import "./CSS/App.css";
import config from "./config";

//OAuth
import { GoogleOAuthProvider } from "@react-oauth/google"

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: "Quicksand",
    },
  });

  const GoogleAuthWrapper = () => {
    return (
      <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
        <Auth />
      </GoogleOAuthProvider>
    );
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route exact path="/auth" element={<GoogleAuthWrapper />} />
          <Route exact path="/" element={<ProtectedRoute Component={HomePage} />} />
          <Route exact path="/project" element={<ProtectedRoute Component={ProjectPage} />} />
          <Route exact path="/project/:projectId" element={<ProtectedRoute Component={Editor} />} />
          <Route exact path="*" element={<PageNotFound />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}
export default App;
