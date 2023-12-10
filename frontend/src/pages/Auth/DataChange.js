import { useState } from "react";
import { Link } from "react-router-dom";

import "./DataChange.css";

import Auth from "./Auth";
import { required, length, isEmail } from "../../util/validators";

function DataChangePage(props) {
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

  return (
    <Auth>
      <div className="signup">
        <h1>Promena podataka</h1>
        {/* {props.error && <p className="error">{props.error}</p>} */}
        <form
          onSubmit={(e) => {
            props.onChangeData(e, {
              email,
              newEmail,
              oldPassword,
              password,
              confirmedPassword,
            });
          }}
        >
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
