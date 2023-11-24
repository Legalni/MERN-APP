import { Link } from "react-router-dom";
import Input from "../../components/Input";
import Auth from "../Auth/Auth";
import { useState } from "react";
import { required, length, isEmail } from "../../util/validators";

import "./AdminLogin.css";

const AdminLogin = (props) => {
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
      return {
        ...prevState,
        valid: isValid,
        value: event.target.value,
        error: !isValid && "Uneta lozinka nije tacna",
      };
    });
  };

  return (
    <Auth>
      <div className="admin-login">
        <h2>Admin Prijava</h2>
        {props.error && <p className="error">{props.error}</p>}
        <form
          onSubmit={(e) => {
            props.onLogin(e, { email, password }, true);
          }}
        >
          <Input
            label="E-mail"
            placeholder="test@test.com"
            type="email"
            onChange={emailChangeHandler}
            value={email.value}
            valid={props.valid}
          />
          <Input
            label="Password"
            placeholder="*****"
            type="password"
            onChange={passwordChangeHandler}
            value={password.value}
            valid={props.valid}
          />
          <button>Prijavi se</button>
        </form>
        <div className="user-login">
          <p>
            Niste admin?<Link to="/login">Prijava za korisnike</Link>
          </p>
        </div>
      </div>
    </Auth>
  );
};
export default AdminLogin;
