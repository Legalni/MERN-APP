import { useEffect, useRef, useState } from "react";

import "./Main.css";
import { useNavigate } from "react-router-dom";

function MainPage(props) {
  const [user, setUser] = useState(null);
  const goodsRef = useRef();
  const quantityRef = useRef();
  const priceRef = useRef();
  const paymentRef = useRef();

  const navigate = useNavigate();

  const token = document.cookie.split("=")[1];

  useEffect(() => {
    if (token) {
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
          console.log(token);
        })
        .catch((err) => console.log("nece fetch"));
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  const addPaymentTransactionHandler = (event) => {
    event.preventDefault();

    const paymentPrice = paymentRef.current.value;

    if (token) {
      fetch("http://localhost:8080/user/add-transaction", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: paymentPrice,
        }),
      })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Nije uspelo dodavanje transakcije.");
          }
          return res.json();
        })
        .then((resData) => {
          console.log(resData);
        })
        .catch((err) => console.log("nece fetch"));
    }
  };

  const addGoodsTransactionHandler = (event) => {
    event.preventDefault();

    const goods = goodsRef.current.value;
    const quantity = quantityRef.current.value;
    const price = priceRef.current.value;

    if (token) {
      fetch("http://localhost:8080/user/add-transaction", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goods: goods,
          quantity: quantity,
          price: price,
        }),
      })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Nije uspelo dodavanje transakcije.");
          }
          return res.json();
        })
        .then((resData) => {
          console.log(resData);
        })
        .catch((err) => console.log("nece fetch"));
    }
  };

  return (
    <>
      {user && (
        <>
          <h2>{user.username}</h2>
          <div>
            <form>
              <h2>Dug: 873033 din</h2>
              <button
                onClick={(e) => {
                  props.onLogout(e, token);
                }}
              >
                Odjavi se
              </button>
            </form>
          </div>
          <form className="goods" onSubmit={addGoodsTransactionHandler}>
            <div>
              <label>Roba</label>
              <input type="text" ref={goodsRef} required></input>
            </div>
            <div>
              <label>Kolicina</label>
              <input type="number" ref={quantityRef} required></input>
            </div>
            <div>
              <label>Cena</label>
              <input type="number" required ref={priceRef}></input>
            </div>
            <div>
              <button type="submit">Posalji zahtev</button>
            </div>
          </form>
          <form className="payment" onSubmit={addPaymentTransactionHandler}>
            <div>
              <label>Uplata</label>
              <input type="number" ref={paymentRef} required></input>
            </div>
            <div>
              <label>Dodatne informacije</label>
              <input></input>
            </div>
            <div>
              <button type="submit">Posalji zahtev</button>
            </div>
          </form>
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
