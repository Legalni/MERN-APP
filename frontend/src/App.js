import { useEffect, useState } from "react";

import "./App.css";
import Login from "./pages/Auth/Login";
import SignupPage from "./pages/Auth/Signup";
import MainPage from "./pages/User/Main";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const [isAuth, setIsAuth] = useState(false);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    navigate("/login");
  };

  const loginHandler = (event, authData) => {
    event.preventDefault();

    if (authData.email.valid && authData.password.valid) {
      fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: authData.email.value,
          password: authData.password.value,
        }),
      })
        .then((res) => {
          if (res.status === 422) {
            throw new Error("Validacija nije uspela.");
          }
          if (res.status !== 200 && res.status !== 201) {
            throw new Error("Ne mozemo vas autentikovati");
          }
          return res.json();
        })
        .then((resData) => {
          setIsAuth(true);
          localStorage.setItem("token", resData.token);
          const remainingMilliseconds = 60 * 60 * 1000;
          const expiryDate = new Date(
            new Date().getTime() + remainingMilliseconds
          );
          localStorage.setItem("expiryDate", expiryDate.toISOString());
          setTimeout(() => {
            logoutHandler();
          }, remainingMilliseconds);
        })
        .then(() => navigate("/main"))
        .catch((err) => {
          setIsAuth(false);
        });
    }
  };

  const signupHandler = (event, authData) => {
    event.preventDefault();

    if (
      authData.username.valid &&
      authData.email.valid &&
      authData.password.valid &&
      authData.confirmedPassword.valid
    ) {
      fetch("http://localhost:8080/auth/signup", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: authData.username.value,
          email: authData.email.value,
          password: authData.password.value,
          confirmedPassword: authData.confirmedPassword.value,
        }),
      })
        .then((res) => {
          if (res.status === 422) {
            throw new Error(
              "Validacija nije uspela. Proverite da li je ovaj email vec iskoriscen"
            );
          }
          if (res.status !== 200 && res.status !== 201) {
            throw new Error("Pravljenje korisnika nije uspelo.");
          }
          return res.json();
        })
        .then((resData) => {
          navigate("/login");
        })
        .catch((err) => {
          setIsAuth(false);
        });
    }
  };

  return (
    <Routes>
      {!isAuth && <Route path="*" element={<Navigate to="/login" />} />}
      {isAuth && <Route path="*" element={<Navigate to="/main" />} />}
      <Route path="/login" element={<Login onLogin={loginHandler} />} />
      <Route path="/signup" element={<SignupPage onSignup={signupHandler} />} />
      <Route path="/main" element={<MainPage onLogout={logoutHandler} />} />
    </Routes>
  );
}

export default App;
