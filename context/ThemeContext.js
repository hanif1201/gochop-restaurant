import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const theme = {
    dark: darkMode,
    colors: darkMode
      ? {
          primary: "#FD6A00",
          background: "#121212",
          card: "#1E1E1E",
          text: "#F5F5F5",
          border: "#333333",
          notification: "#FD6A00",
          error: "#FF6B6B",
          success: "#28A745",
          warning: "#FFC107",
          info: "#17A2B8",
          gray: "#888888",
        }
      : {
          primary: "#FD6A00",
          background: "#FFFFFF",
          card: "#F5F5F5",
          text: "#212121",
          border: "#EEEEEE",
          notification: "#FD6A00",
          error: "#DC3545",
          success: "#28A745",
          warning: "#FFC107",
          info: "#17A2B8",
          gray: "#6C757D",
        },
  };

  return (
    <ThemeContext.Provider value={{ theme, darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
