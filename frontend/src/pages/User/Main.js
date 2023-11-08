import { useEffect, useState } from "react";

import "./Main.css";

function MainPage(props) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiryDate");
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    if (!token || !expiryDate) {
      return;
    }
    if (new Date(expiryDate) <= new Date()) {
      props.onLogout();
      return;
    }
    fetch("http://localhost:8080/user/main", {
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
        setUser(resData.user);
      })
      .catch((err) => console.log("nece fetch"));

    setTimeout(() => {
      props.onLogout();
    }, remainingMilliseconds);
  }, []);

  return (
    <>
      {user && (
        <>
          <h2>{user.username}</h2>
          <div>
            <form onSubmit={props.onLogout}>
              <h2>Dug: 873033 din</h2>
              <button type="submit">Odjavi se</button>
            </form>
          </div>
          <div className="goods">
            <div>
              <label>Roba</label>
              <input></input>
            </div>
            <div>
              <label>Kolicina</label>
              <input></input>
            </div>
            <div>
              <label>Cena</label>
              <input></input>
            </div>
            <div>
              <button>Posalji zahtev</button>
            </div>
          </div>
          <div className="payment">
            <div>
              <label>Uplata</label>
              <input></input>
            </div>
            <div>
              <label>Dodatne informacije</label>
              <input></input>
            </div>
            <div>
              <button>Posalji zahtev</button>
            </div>
          </div>
          <div className="user-transactions">
            <header>subota, 10.jun 2023.</header>
            <div className="transaction">
              <p>Roba: 2</p>
              <p>Cena: 1 din</p>
              <p>Kolicina: 1x</p>
              <p>Dug: 1 din</p>
            </div>
            <footer>Dug za ovaj Dan: 61735</footer>
          </div>
        </>
      )}
    </>
  );
}

export default MainPage;