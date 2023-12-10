import { useEffect, useState } from "react";

import Login from "./pages/Auth/Login";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminMain from "./pages/Admin/AdminMain";
import SignupPage from "./pages/Auth/Signup";
import MainPage from "./pages/User/Main";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import UserProfile from "./pages/Admin/UserProfile";
import Transactions from "./pages/Admin/Transactions";
import DataChangePage from "./pages/Auth/DataChange";

function App() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
  }, [navigate]);

  const logoutHandler = (event, admin = false) => {
    event.preventDefault();

    const permission = admin ? "admin" : "user";

    fetch(`http://localhost:8080/${permission}/logout`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => {
        navigate(admin ? "/admin/login" : "/login");
      })
      .catch((err) => console.log("Ne mozete se izlogovati"));
  };

  const loginHandler = (event, authData, admin = false) => {
    event.preventDefault();

    const permission = admin ? "admin-login" : "login";

    if (!authData.email.valid && !authData.password.valid) {
      return setError("Unesite ispravne podatke");
    }
    if (!authData.email.valid) {
      return setError("Unesite ispravnu e-mail adresu");
    }
    if (!authData.password.valid) {
      return setError("Unesite ispravnu lozinku");
    }

    fetch(`http://localhost:8080/auth/${permission}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: authData.email.value,
        password: authData.password.value,
      }),
      credentials: "include",
    })
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((resData) => {
        if (resData.error) {
          setError(resData.error.message);
        } else {
          setError(null);
          navigate(admin ? "/admin/allUsers" : "/main");
        }
      })
      .catch((err) => {
        setError("Doslo je do greske. Pokusajte ponovo.");
      });
  };

  const signupHandler = (event, authData) => {
    event.preventDefault();

    if (!authData.username.valid) {
      return setError("Unesite ispravno korisnicko ime");
    }

    if (!authData.email.valid) {
      return setError("Unesite ispravan e-mail");
    }

    if (!authData.password.valid || !authData.confirmedPassword.valid) {
      return setError("Unesite ispravnu lozinku");
    }

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
        if (res.ok) {
          return res.json();
        }
      })
      .then((resData) => {
        if (resData.error) {
          setError(resData.error.message);
        } else {
          setError(null);
          navigate("/login");
        }
      })
      .catch((err) => {
        setError("Doslo je do greske. Pokusajte ponovo.");
      });
  };

  const dataChangeHandler = (event, authData) => {
    event.preventDefault();

    if (!authData.email.valid) {
      return setError("Unesite ispravan e-mail");
    }

    if (
      !authData.oldPassword.valid ||
      !authData.password.valid ||
      !authData.confirmedPassword.valid
    ) {
      return setError("Unesite ispravnu lozinku");
    }

    fetch("http://localhost:8080/auth/change-data", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: authData.email.value,
        newEmail: authData.newEmail?.value,
        oldPassword: authData.oldPassword.value,
        password: authData.password.value,
        confirmedPassword: authData.confirmedPassword.value,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((resData) => {
        if (resData.error) {
          setError(resData.error.message);
        } else {
          setError(null);
          navigate("/login");
        }
      })
      .catch((err) => {
        setError("Doslo je do greske. Pokusajte ponovo.");
      });
  };

  return (
    <Routes>
      <Route path="/" exact element={<Navigate to="/login" />} />
      <Route
        path="/login"
        element={<Login onLogin={loginHandler} error={error} />}
      />
      <Route
        path="/signup"
        element={<SignupPage onSignup={signupHandler} error={error} />}
      />
      <Route
        path="auth-info-change"
        element={<DataChangePage onChangeData={dataChangeHandler} />}
      />
      <Route path="/main" element={<MainPage onLogout={logoutHandler} />} />
      <Route
        path="/admin/login"
        element={<AdminLogin onLogin={loginHandler} error={error} />}
      />
      <Route
        path="/admin/allUsers"
        element={<AdminMain onLogout={logoutHandler} />}
      />
      <Route path="/admin/user/:username" element={<UserProfile />} />
      <Route path="/admin/transactions" element={<Transactions />} />
    </Routes>
  );
}

export default App;
