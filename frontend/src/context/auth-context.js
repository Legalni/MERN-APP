// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // useEffect(() => {
  //   fetch("http://localhost:8080/auth/checkAuth", {
  //     method: "POST",
  //     credentials: "include",
  //   })
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => {
  //       // if (data.isAuthenticated) {
  //       //   if (data.isAdmin) {
  //       //     navigate("/admin/allUsers");
  //       //   } else {
  //       //     navigate("/main");
  //       //   }
  //       // }
  //       // if (
  //       //   !data.isAuthenticated &&
  //       //   !window.location.pathname.startsWith("/login")
  //       // ) {
  //       //   navigate("/login");
  //       // }
  //     })
  //     .catch((error) => {
  //       console.error("Error checking authentication:", error);
  //       // Ovde možete postaviti stanje ako dođe do greške
  //     });
  // }, [navigate]);

  const value = {
    error,
    setError,
    navigate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
