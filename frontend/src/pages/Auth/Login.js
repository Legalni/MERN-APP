import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Login.css";

import Auth from "./Auth";
import { required, length, isEmail } from "../../util/validators";
import Input from "../../components/Input";

function Login(props) {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/auth/checkAuth", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.isAuthenticated) {
          navigate(resData.isAdmin ? "/admin/allUsers" : "/main");
        } else {
          navigate("/login");
        }
      });
  }, [navigate]);

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
      <a className="admin-link" href="admin/login">
        Admin
      </a>
      <div className="login">
        <h2>Prijavite se</h2>
        {props.error && <p className="error">{props.error}</p>}
        <form
          onSubmit={(e) => {
            props.onLogin(e, { email, password });
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
        <div className="user-options">
          <Link to="/signup">Registrujte se</Link>
          <Link to="/auth-info-change">Promena podataka</Link>
        </div>
      </div>
    </Auth>
  );
}

export default Login;
