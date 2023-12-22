import { useState } from "react";
import { Link } from "react-router-dom";

import "./DataChange.css";

import Auth from "./Auth";
import { required, length, isEmail } from "../../util/validators";
import { useAuth } from "../../context/auth-context";

function DataChangePage(props) {
  const ctx = useAuth();

  const { error, setError, navigate } = ctx;

  const [email, setEmail] = useState({
    value: "",
    valid: false,
    validators: [required, isEmail],
  });
  const [newEmail, setNewEmail] = useState({
    value: "",
    valid: false,
    validators: [isEmail],
  });
  const [oldPassword, setOldPassword] = useState({
    value: "",
    valid: false,
    validators: [required, length({ min: 5 })],
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

  const emailChangeHandler = (event) => {
    let isValid;
    email.validators.forEach((validator) => {
      isValid = validator(event.target.value);
    });
    setEmail((prevState) => {
      return { ...prevState, valid: isValid, value: event.target.value };
    });
  };

  const newEmailChangeHandler = (event) => {
    let isValid;
    newEmail.validators.forEach((validator) => {
      isValid = validator(event.target.value);
    });
    setNewEmail((prevState) => {
      return { ...prevState, valid: isValid, value: event.target.value };
    });
  };

  const oldPasswordChangeHandler = (event) => {
    let isValid;
    oldPassword.validators.forEach((validator) => {
      isValid = validator(event.target.value);
    });
    setOldPassword((prevState) => {
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

  const dataChangeHandler = (event) => {
    event.preventDefault();

    if (email.valid) {
      return setError("Unesite ispravan e-mail");
    }

    if (oldPassword.valid || password.valid || confirmedPassword.valid) {
      return setError("Unesite ispravnu lozinku");
    }

    fetch("http://localhost:8080/auth/change-data", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        newEmail: newEmail?.value,
        oldPassword: oldPassword.value,
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
        <h1>Promena podataka</h1>
        {props.error && <p className="error">{props.error}</p>}
        <form onSubmit={dataChangeHandler}>
          <div className="email">
            <p>Email</p>
            <input
              placeholder="test@test.com"
              onChange={emailChangeHandler}
              value={email.value}
            ></input>
          </div>
          <div className="email">
            <p>Novi Email (nije obavezno)</p>
            <input
              placeholder="test@test.com"
              onChange={newEmailChangeHandler}
              value={newEmail.value}
            ></input>
          </div>
          <div className="password">
            <p>Stara Lozinka</p>{" "}
            <input
              placeholder="*****"
              type="password"
              onChange={oldPasswordChangeHandler}
              value={oldPassword.value}
            ></input>
          </div>
          <div className="password">
            <p>Nova Lozinka</p>{" "}
            <input
              placeholder="*****"
              type="password"
              onChange={passwordChangeHandler}
              value={password.value}
            ></input>
          </div>
          <div className="password">
            <p>Potvrdi Novu Lozinku</p>{" "}
            <input
              placeholder="*****"
              type="password"
              onChange={confirmedPasswordChangeHandler}
              value={confirmedPassword.value}
            ></input>
          </div>
          <button>Registruj se</button>
        </form>
        <div className="href">
          <Link to="/login">Prijavi se</Link>
        </div>
      </div>
    </Auth>
  );
}

export default DataChangePage;
