// Step 1: React hook gulo import korchi
import React, { createContext, useState, useEffect } from "react";

// Step 2: ThemeContext toiri korchi jate kono kompotent jante pare j ekhon kon theme cholche
export const ThemeContext = createContext();

// Step 3: Provider banacchi ja App k wrap korbe
export const ThemeProvider = ({ children }) => {
  // Local storage theke check korbe purono theme set kora chilo kina, na thakle default 'dark'
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  // Step 4: useEffect - kokhon call hobe? jokhon 'theme' variable ta change hobe tokhon
  useEffect(() => {
    // Local storage a current theme ta save kore rakhchi
    localStorage.setItem("theme", theme);
    // HTML er <body> tag er ekta class dicchi (jemon: class="dark" ba class="light")
    document.body.className = theme;
  }, [theme]);

  // Step 5: Ei function dake theme change kora hobe (onkhetar moto button theke)
  const toggleTheme = () => {
    // Jodi light thake thole dark koro, na hole light koro
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // shob child context theke useTheme() kore theme ar toggleTheme niye nibey
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
