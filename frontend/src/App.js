import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminMain from "./pages/Admin/AdminMain";
import SignupPage from "./pages/Auth/Signup";
import MainPage from "./pages/User/Main";
import UserProfile from "./pages/Admin/UserProfile";
import Transactions from "./pages/Admin/Transactions";
import DataChangePage from "./pages/Auth/DataChange";
import { AuthProvider, useAuth } from "./context/auth-context";

function App() {
  const ctx = useAuth();
  const { setError, navigate } = ctx;

  useEffect(() => {
    setError(null);

    fetch("http://localhost:8080/auth/status", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((resData) => {
        if (!resData.isAuthenticated) {
          navigate("/login");
        } else if (resData.isAdmin) {
          navigate("/admin/allUsers");
        } else {
          navigate("/main");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/auth-info-change" element={<DataChangePage />} />
      <Route path="/admin/user/:username" element={<UserProfile />} />
      <Route path="/admin/transactions" element={<Transactions />} />
      <Route path="/admin/allUsers" element={<AdminMain />} />
    </Routes>
  );
}

export default App;
