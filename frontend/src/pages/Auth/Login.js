import { useState } from "react";
import { Link } from "react-router-dom";

import "./Login.css";

import Auth from "./Auth";
import { required, length, isEmail } from "../../util/validators";

function Login(props) {
  const initialEmail = {
    value: "",
    valid: false,
    validators: [required, isEmail],
  };

  const initialPassword = {
    value: "",
    valid: false,
    validators: [required, length({ min: 5 })],
  };

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);

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

  return (
    <Auth>
      <div className="login">
        <h2>Prijavite se</h2>
        <form
          onSubmit={(e) => {
            props.onLogin(e, { email, password });
          }}
        >
          <div className="email">
            <p>Email</p>
            <input
              placeholder="test@test.com"
              type="email"
              onChange={emailChangeHandler}
              value={email.value}
            ></input>
          </div>
          <div className="password">
            <p>Password</p>{" "}
            <input
              placeholder="*****"
              type="password"
              onChange={passwordChangeHandler}
              value={password.value}
            ></input>
          </div>
          <button>Prijavi se</button>
        </form>
        <div className="user-options">
          <Link to="/signup">Registrujte se</Link>
          <Link to="/change-informations">Promena podataka</Link>
        </div>
      </div>
    </Auth>
  );
}

export default Login;
