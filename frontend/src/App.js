import { useState } from "react";

import Login from "./pages/Auth/Login";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminMain from "./pages/Admin/AdminMain";
import SignupPage from "./pages/Auth/Signup";
import MainPage from "./pages/User/Main";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const logoutHandler = (event, token, admin = false) => {
    event.preventDefault();

    const permission = admin ? "admin" : "user";

    fetch(`http://localhost:8080/${permission}/logout`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then(() => {
        document.cookie = "token=; Max-Age=0; path=/";
      })
      .then(() => {
        navigate(admin ? "/admin/login" : "/login");
      })
      .catch((err) => console.log("Ne mozete se izlogovati"));
  };

  // const adminLoginHandler = (event, authData) => {
  //   event.preventDefault();

  //   if (!authData.email.valid && !authData.password.valid) {
  //     setError("Uneti podaci nisu tacni");
  //     return;
  //   }
  //   if (!authData.email.valid) {
  //     setError("Unesite ispravnu e-mail adresu");
  //     return;
  //   }
  //   if (!authData.password.valid) {
  //     setError("Unesite ispravnu lozinku");
  //     return;
  //   }

  //   fetch("http://localhost:8080/auth/admin-login", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       email: authData.email.value,
  //       password: authData.password.value,
  //     }),
  //   })
  //     .then((res) => {
  //       console.log(res);
  //       if (res.status === 404) {
  //         console.log("NemaS");
  //       }

  //       if (res.status === 422) {
  //         throw new Error("Validacija nije uspela.");
  //       }
  //       if (res.status !== 200 && res.status !== 201) {
  //         throw new Error("Ne mozemo vas autentikovati");
  //       }
  //       return res.json();
  //     })
  //     .then((resData) => {
  //       const time = 60 * 60 * 1000;
  //       const expires = new Date(Date.now() + time).toUTCString();
  //       document.cookie = `token=${resData.token}; expires=${expires}; path='/'`;
  //       setError(null);
  //       setTimeout(() => {
  //         logoutHandler(event, resData.token, true);
  //         navigate("/admin/login");
  //       }, time);
  //     })
  //     .then(() => navigate("/admin/allUsers"))
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  // };

  const loginHandler = (event, authData, admin = false) => {
    event.preventDefault();

    const permission = admin ? "admin-login" : "login";

    if (!authData.email.valid && !authData.password.valid) {
      setError("Uneti podaci nisu tacni");
      return;
    }
    if (!authData.email.valid) {
      setError("Unesite ispravnu e-mail adresu");
      return;
    }
    if (!authData.password.valid) {
      setError("Unesite ispravnu lozinku");
      return;
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
      .then((res) => {
        console.log(res);
        if (res.status === 404) {
        }

        if (res.status === 422) {
          throw new Error("Validacija nije uspela.");
        }
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Ne mozemo vas autentikovati");
        }
        return res.json();
      })
      .then((resData) => {
        const time = 60 * 60 * 1000;
        const expires = new Date(Date.now() + time).toUTCString();
        // document.cookie = `token=${resData.token}; expires=${expires}; path='/'`;
        setError(null);
        // setTimeout(() => {
        //   logoutHandler(event, resData.token, admin ? true : false);
        //   navigate(admin ? "/admin/login" : "/login");
        // }, time);
      })
      .then(() => navigate(admin ? "/admin/allUsers" : "/main"))
      .catch((err) => {
        console.log(err.message);
      });
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
        .catch((err) => {});
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        exact
        element={
          document.cookie ? <Navigate to="/main" /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/login"
        element={<Login onLogin={loginHandler} error={error} />}
      />
      <Route path="/signup" element={<SignupPage onSignup={signupHandler} />} />
      <Route path="/main" element={<MainPage onLogout={logoutHandler} />} />
      <Route
        path="/admin/login"
        element={<AdminLogin onLogin={loginHandler} error={error} />}
      />
      <Route
        path="/admin/allUsers"
        element={<AdminMain onLogout={logoutHandler} />}
      />
    </Routes>
  );
}

export default App;
