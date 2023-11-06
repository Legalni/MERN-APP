import { useState } from "react";
import { Link } from "react-router-dom";

import "./Signup.css";

import Auth from "./Auth";
import { required, length, isEmail } from "../../util/validators";

function SignupPage(props) {
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
    console.log(username.valid);
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

  return (
    <Auth>
      <div className="signup">
        <h2>Registrujte se</h2>
        <form
          onSubmit={(e) =>
            props.onSignup(e, {
              username,
              email,
              password,
              confirmedPassword,
            })
          }
        >
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
          <Link to="/change-informations">Promena podataka</Link>
        </div>
      </div>
    </Auth>
  );
}

export default SignupPage;
