import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminMain.css";

const AdminMain = (props) => {
  const [admin, setAdmin] = useState(null);

  const navigate = useNavigate();

  const token = document.cookie.split("=")[1];

  useEffect(() => {
    if (token) {
      fetch("http://localhost:8080/admin/main", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Ne moze fetchovati usera.");
          }
          return res.json();
        })
        .then((resData) => {
          setAdmin(resData.admin);
          console.log(token);
        })
        .catch((err) => console.log("nece fetch"));
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <>
      {admin && (
        <>
          <div>
            <div className="progress-bar">
              <div className="progress-bar-value"></div>
            </div>
            <div className="logout">
              <button
                onClick={(e) => {
                  props.onLogout(e, token, true);
                }}
              >
                Odjavi se
              </button>
            </div>
            <div className="show-requests">
              <button>Prikazi zahteve</button>
            </div>
          </div>
          <div className="user-form">
            <div>
              <label>Ime</label>
              <input />
            </div>
            <div>
              <label>Roba</label>
              <input />
            </div>
            <div>
              <label>Kolicina</label>
              <input />
            </div>
            <div>
              <label>Cena</label>
              <input />
            </div>
            <div></div>
            <div>
              <button>Potvrdi</button>
            </div>
            <div>
              <button>
                <Link to="/admin/transactions">Transakcije</Link>
              </button>
            </div>
          </div>
          <div className="users">
            <div className="user">
              <Link to="admin/user/Dejan%20Markovic">Dejan Markovic</Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdminMain;
