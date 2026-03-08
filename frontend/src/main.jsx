// Step 1: React chalanor main library gulo import korchi
import React from "react";
import ReactDOM from "react-dom/client";
// Router import korchi jate pura app e routing kaj kore
import { BrowserRouter } from "react-router-dom";

// Step 2: Amader main App component ar global CSS ta niye aslam
import App from "./App.jsx";
import "./index.css";

// Step 3: Context Provider gulo import korchi (jara pura app ke data debe)
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

/**
 * Step 4: Render Section
 * BrowserRouter diye pura App ke wrap korchi jate React Router er sob features (Links, Routes) kaj kore.
 * We wrap the app in BrowserRouter here so all components can use routing features.
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
