import { useEffect, useRef, useState } from "react";

import "./Main.css";
import { useNavigate, useResolvedPath } from "react-router-dom";

function MainPage(props) {
  const [user, setUser] = useState(null);
  const [debt, setDebt] = useState(0);
  const goodsRef = useRef();
  const quantityRef = useRef();
  const priceRef = useRef();
  const paymentRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/user/main", {
      credentials: "include",
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Ne moze fetchovati usera.");
        }
        return res.json();
      })
      .then((resData) => {
        const transactions = resData.user.transactions;

        const debt = transactions.reduce(
          (acc, transaction) => acc + transaction.debt,
          0
        );

        console.log(debt);

        setUser(resData.user);
        setDebt(debt);
      })
      .catch((err) => console.log("nece fetch"));
  }, []);

  const addPaymentTransactionHandler = (event) => {
    event.preventDefault();

    const paymentPrice = paymentRef.current.value;

    fetch("http://localhost:8080/user/add-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price: paymentPrice,
      }),
      credentials: "include",
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Nije uspelo dodavanje transakcije.");
        }
        return res.json();
      })
      .then((resData) => {
        paymentRef.current.value = null;
      })
      .catch((err) => console.log("nece fetch"));
  };

  const addGoodsTransactionHandler = (event) => {
    event.preventDefault();

    const goods = goodsRef.current.value;
    const quantity = quantityRef.current.value;
    const price = priceRef.current.value;

    fetch("http://localhost:8080/user/add-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        goods: goods,
        quantity: quantity,
        price: price,
      }),
      credentials: "include",
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Nije uspelo dodavanje transakcije.");
        }
        return res.json();
      })
      .then((resData) => {
        goodsRef.current.value = null;
        quantityRef.current.value = null;
        priceRef.current.value = null;
      })
      .catch((err) => console.log("nece fetch"));
  };

  return (
    <>
      {user && (
        <>
          <h2>Korisnik: {user.username}</h2>
          <div>
            <form className="userLogout">
              <h2>Dug: {debt} din</h2>
              <button
                onClick={(e) => {
                  props.onLogout(e);
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
            <header>
              <p>subota, 10.jun 2023.</p>
            </header>
            {user.transactions.map((transaction) => {
              return transaction.hasOwnProperty("goods") ? (
                <div key={transaction._id} className="goodsTransaction">
                  <p>Roba: {transaction.goods}</p>
                  <p>Cena: {transaction.price} din</p>
                  <p>Kolicina: {transaction.quantity} x</p>
                  <p>Dug: {transaction.debt} din</p>
                </div>
              ) : (
                <div key={transaction._id} className="paymentTransaction">
                  <p>Uplata</p>
                  <p></p>
                  <p>{transaction.debt} din</p>
                </div>
              );
            })}
            <footer>
              <p>Dug za ovaj Dan: 61735</p>
            </footer>
          </div>
        </>
      )}
    </>
  );
}

export default MainPage;
