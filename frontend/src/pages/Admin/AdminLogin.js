import { Link } from "react-router-dom";
import Input from "../../components/Input";
import Auth from "../Auth/Auth";
import { useState } from "react";
import { required, length, isEmail } from "../../util/validators";

import "./AdminLogin.css";
import { useAuth } from "../../context/auth-context";

const AdminLogin = () => {
  const ctx = useAuth();

  const { error, setError, navigate } = ctx;

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

  const adminLoginHandler = (event) => {
    event.preventDefault();

    if (!email.valid && !password.valid) {
      return setError("Unesite ispravne podatke");
    }
    if (!email.valid) {
      return setError("Unesite ispravnu e-mail adresu");
    }
    if (!password.valid) {
      return setError("Unesite ispravnu lozinku");
    }

    fetch(`http://localhost:8080/auth/admin-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
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
          navigate("/admin/allUsers");
        }
      })
      .catch((err) => {
        setError("Doslo je do greske. Pokusajte ponovo.");
      });
  };

  return (
    <Auth>
      <div className="admin-login">
        <h2>Admin Prijava</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={adminLoginHandler}>
          <Input
            label="E-mail"
            placeholder="test@test.com"
            type="email"
            onChange={emailChangeHandler}
            value={email.value}
            valid={email.valid}
          />
          <Input
            label="Password"
            placeholder="*****"
            type="password"
            onChange={passwordChangeHandler}
            value={password.value}
            valid={password.valid}
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
