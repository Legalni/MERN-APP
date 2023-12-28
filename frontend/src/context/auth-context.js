// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   fetch("http://localhost:8080/auth/status", {
  //     credentials: "include",
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //       if (data.isAuthenticated) {
  //         if (data.isAdmin) {
  //           // navigate("/admin/allUsers");
  //           setIsLoggedIn(true);
  //           setIsAdmin(true);
  //         } else {
  //           setIsLoggedIn(true);
  //           setIsAdmin(false);
  //         }
  //       } else {
  //         setIsLoggedIn(false);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error checking authentication:", error);
  //       // Ovde možete postaviti stanje ako dođe do greške
  //     });
  // }, []);

  const value = {
    error,
    setError,
    navigate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
