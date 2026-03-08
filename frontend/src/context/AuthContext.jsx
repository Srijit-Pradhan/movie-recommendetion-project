// Step 1: React theke lagbe emon hook gulo nichhi
// createContext: global state toiri korar jonno
// useState: data dhore rakhar jonno, useEffect: component load hole ba data change hole kichu korar jonno
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import api from "../services/api";

// Step 2: AuthContext toiri korchi, jate shob component user er bapare jante pare
export const AuthContext = createContext();

// Step 3: AuthProvider -> Eta hocche main component jeta onno shob component ke wrap korbe (main.jsx e)
export const AuthProvider = ({ children }) => {
  // State gulo toiri korchi
  const [user, setUser] = useState(null); // Backend theke asa user data
  // LocalStorage theke token age theke pawa gele nicchi, na hole null
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true); // Prothome page load hobar somoy loading true rakhbo

  // Step 4: Backend theke logged-in user er profile data anar function
  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/api/users/profile");
      setUser(data);
      return data;
    } catch (error) {
      console.error("Error fetching profile", error);
      logout(); // Error khele ba token expire hole logout kore debo
    }
  };

  // Step 5: useEffect - jokhon e token change hobe tokhon ei block code cholbe
  useEffect(() => {
    if (token) {
      // Token thakle axios er default header e set kore dichi ('Bearer <token>')
      // Jate porer shob backend request e token ta automatic chole jay
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token); // browser eo save kore rakhchi

      // Page reload hole jate user data chole na jay, tai abar fetchProfile() dakchi
      fetchProfile().finally(() => setLoading(false));
    } else {
      // Jodi token na thake tahole sob clear kore dichi
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  // Step 6: Login function
  const login = async (email, password) => {
    const { data } = await api.post("/api/auth/login", {
      email,
      password,
    });
    setToken(data.token); // Token pawar por sathe sathe log in hoye jabe karon useEffect cholbe
    setUser(data);
    return data;
  };

  // Step 7: Register (Sign up) function
  const register = async (name, email, password) => {
    const { data } = await api.post(
      "/api/auth/register",
      { name, email, password },
    );
    setToken(data.token);
    setUser(data);
    return data;
  };

  // Step 8: Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  // Step 9: Refresh user function
  // Kono user jokhon kono movie watch history ba favorites e add korbe, tokhon shob data navbar obdi sync korar jonno ata lagbe
  const refreshUser = async () => {
    if (token) {
      await fetchProfile();
    }
  };

  // Jotokhon loading cholche totkhon blank screen othoba kono boro jhamela avoid korar jonno
  // loading false hbar pore children guloke dekhacchi
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        login,
        register,
        logout,
        loading,
        refreshUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
