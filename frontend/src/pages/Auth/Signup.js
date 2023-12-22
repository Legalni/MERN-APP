import { useState } from "react";
import { Link } from "react-router-dom";

import "./Signup.css";

import Auth from "./Auth";
import { required, length, isEmail } from "../../util/validators";
import { useAuth } from "../../context/auth-context";

function SignupPage() {
  const ctx = useAuth();

  const { error, setError, navigate } = ctx;

  const [username, setUsername] = useState({
    value: "",
    valid: false,
    validators: [required, length({ min: 3 })],
  });
  const [email, setEmail] = useState({
    value: "",
    valid: false,
    validators: [required, isEmail],
  });
  const [password, setPassword] = useState({
    value: "",
    valid: false,
    validators: [required, length({ min: 5 })],
  });
  const [confirmedPassword, setConfirmedPassword] = useState({
    value: "",
    valid: false,
    validators: [required, length({ min: 5 })],
  });

  const usernameChangeHandler = (event) => {
    let isValid;
    username.validators.forEach((validator) => {
      isValid = validator(event.target.value);
    });
    setUsername((prevState) => {
      return { ...prevState, valid: isValid, value: event.target.value };
    });
  };

  const emailChangeHandler = (event) => {
    let isValid;
    email.validators.forEach((validator) => {
      isValid = validator(event.target.value);
    });
    setEmail((prevState) => {
      return { ...prevState, valid: isValid, value: event.target.value };
    });
  };

  const passwordChangeHandler = (event) => {
    let isValid;
    password.validators.forEach((validator) => {
      isValid = validator(event.target.value);
    });
    setPassword((prevState) => {
      return { ...prevState, valid: isValid, value: event.target.value };
    });
  };

  const confirmedPasswordChangeHandler = (event) => {
    let isValid;
    confirmedPassword.validators.forEach((validator) => {
      isValid = validator(event.target.value);
    });
    setConfirmedPassword((prevState) => {
      return { ...prevState, valid: isValid, value: event.target.value };
    });
  };

  const signupHandler = (event) => {
    event.preventDefault();

    if (username.valid) {
      return setError("Unesite ispravno korisnicko ime");
    }

    if (email.valid) {
      return setError("Unesite ispravan e-mail");
    }

    if (password.valid || confirmedPassword.valid) {
      return setError("Unesite ispravnu lozinku");
    }

    fetch("http://localhost:8080/auth/signup", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
        confirmedPassword: confirmedPassword.value,
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
    <Auth>
      <div className="signup">
        <h1>Registrujte se</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={signupHandler}>
          <div className="username">
            <p>Korisnicko Ime</p>
            <input
              placeholder="Petar Petrovic"
              onChange={usernameChangeHandler}
              value={username.value}
            ></input>
          </div>
          <div className="email">
            <p>Email</p>
            <input
              placeholder="test@test.com"
              onChange={emailChangeHandler}
              value={email.value}
            ></input>
          </div>
          <div className="password">
            <p>Lozinka</p>{" "}
            <input
              placeholder="*****"
              type="password"
              onChange={passwordChangeHandler}
              value={password.value}
            ></input>
          </div>
          <div className="password">
            <p>Potvrdi Lozinku</p>{" "}
            <input
              placeholder="*****"
              type="password"
              onChange={confirmedPasswordChangeHandler}
              value={confirmedPassword.value}
            ></input>
          </div>
          <button>Registruj se</button>
        </form>
        <div className="user-options">
          <Link to="/login">Ulogujte se</Link>
          <Link to="/auth-info-change">Promena podataka</Link>
        </div>
      </div>
    </Auth>
  );
}

export default SignupPage;
