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
import Secret from "./pages/Auth/Secret";

function App() {
  const [role, setRole] = useState(null);
  const ctx = useAuth();
  const { setError, navigate } = ctx;

  return (
    <Routes>
      <Route path="*" element={<Secret setRole={setRole} role={role} />} />
      {!role && (
        <>
          <Route path="/login" exact element={<Login />} />
          <Route path="/admin/login" exact element={<AdminLogin />} />
          <Route path="/signup" exact element={<SignupPage />} />
          <Route path="/auth-info-change" exact element={<DataChangePage />} />
        </>
      )}
      {role === "user" && <Route path="/main" exact element={<MainPage />} />}
      {role === "admin" && (
        <>
          <Route path="/admin/user/:username" exact element={<UserProfile />} />
          <Route path="/admin/transactions" exact element={<Transactions />} />
          <Route path="/admin/allUsers" exact element={<AdminMain />} />{" "}
        </>
      )}
    </Routes>
  );
}

export default App;
