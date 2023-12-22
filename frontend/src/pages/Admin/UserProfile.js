import { useParams, useNavigate, Link } from "react-router-dom";

import "./UserProfile.css";
import { useEffect, useRef, useState } from "react";

const UserProfile = (props) => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [debt, setDebt] = useState(0);
  const [groupedTransactions, setGroupedTransactions] = useState({});
  const navigate = useNavigate();
  const goodsInputRef = useRef();
  const quantityInputRef = useRef();
  const priceInputRef = useRef();
  const paymentInputRef = useRef();

  useEffect(() => {
    fetch(`http://localhost:8080/admin/user/${username}`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Ne moze fetchovati usera.");
        }
        return res.json();
      })
      .then((resData) => {
        const userTransactions = resData.user.transactions;

        const userDebt = userTransactions.reduce(
          (acc, transaction) => acc + transaction.debt,
          0
        );

        setUser(resData.user);
        setDebt(userDebt);

        const newGroupedTransactions = {};

        userTransactions.forEach((transaction) => {
          const transactionDate = new Date(transaction.createdAt);
          const date = `${transactionDate.getDate()}.${
            transactionDate.getMonth() + 1
          }.${transactionDate.getFullYear()}`;

          if (!newGroupedTransactions[date]) {
            newGroupedTransactions[date] = [];
          }

          const isTransactionAdded = newGroupedTransactions[date].some(
            (existingTransaction) => existingTransaction._id === transaction._id
          );

          if (!isTransactionAdded) {
            newGroupedTransactions[date].push(transaction);
          }
        });

        setGroupedTransactions(newGroupedTransactions);
      });
  }, [username]);

  const deleteUserHandler = (event) => {
    event.preventDefault();

    fetch(`http://localhost:8080/admin/delete-user/${user._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((resData) => {
        navigate("/admin/allUsers");
      })
      .catch((err) => console.log(err));
  };

  const deleteTransactionHandler = (event, data) => {
    event.preventDefault();

    console.log(data);

    fetch(`http://localhost:8080/admin/delete-transaction/${data.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((resData) => {
        setUser((prevUser) => {
          const updatedUser = {
            ...prevUser,
            transactions: prevUser.transactions.filter(
              (transaction) =>
                transaction._id.toString() !== resData.transactionId.toString()
            ),
          };

          const updatedDebt = updatedUser.transactions.reduce(
            (acc, transaction) => acc + transaction.debt,
            0
          );

          setDebt(updatedDebt);

          setGroupedTransactions((prevGroupedTransactions) => {
            const newGroupedTransactions = { ...prevGroupedTransactions };

            Object.keys(newGroupedTransactions).forEach((date) => {
              newGroupedTransactions[date] = newGroupedTransactions[
                date
              ].filter(
                (transaction) =>
                  transaction._id.toString() !==
                  resData.transactionId.toString()
              );
            });

            return newGroupedTransactions;
          });

          return updatedUser;
        });
      })
      .catch((err) => console.log(err));
  };

  const addGoodsTransactionHandler = async (event) => {
    event.preventDefault();

    const goods = goodsInputRef.current.value;
    const quantity = quantityInputRef.current.value;
    const price = priceInputRef.current.value;

    try {
      const res = await fetch(
        "http://localhost:8080/admin/post-add-transaction",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            goods,
            price,
            quantity,
          }),
          credentials: "include",
        }
      );

      const resData = await res.json();
      const transactionDate = new Date(resData.newTransaction.createdAt);

      setUser((prevUser) => {
        const updatedUser = {
          ...prevUser,
          transactions: resData.transactions,
        };

        const updatedDebt = updatedUser.transactions.reduce(
          (acc, transaction) => acc + transaction.debt,
          0
        );

        setDebt(updatedDebt);

        return updatedUser;
      });

      setGroupedTransactions((prevGroupedTransactions) => {
        const date = `${transactionDate.getDate()}.${
          transactionDate.getMonth() + 1
        }.${transactionDate.getFullYear()}`;

        const existingTransactions = prevGroupedTransactions[date] || [];
        const newTransaction = resData.newTransaction;

        const isTransactionAdded = existingTransactions.some(
          (transaction) => transaction._id === newTransaction._id
        );

        if (!isTransactionAdded) {
          return {
            ...prevGroupedTransactions,
            [date]: [...existingTransactions, newTransaction],
          };
        }

        return prevGroupedTransactions;
      });

      goodsInputRef.current.value = null;
      quantityInputRef.current.value = null;
      priceInputRef.current.value = null;
    } catch (error) {
      console.error(error);
    }
  };

  const addPaymentTransactionHandler = async (event) => {
    event.preventDefault();

    const price = paymentInputRef.current.value;

    try {
      const res = await fetch(
        "http://localhost:8080/admin/post-add-transaction",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            price,
          }),
          credentials: "include",
        }
      );

      const resData = await res.json();
      const transactionDate = new Date(resData.newTransaction.createdAt);

      setUser((prevUser) => {
        const updatedUser = {
          ...prevUser,
          transactions: resData.transactions,
        };

        const updatedDebt = updatedUser.transactions.reduce(
          (acc, transaction) => acc + transaction.debt,
          0
        );

        setDebt(updatedDebt);

        return updatedUser;
      });

      setGroupedTransactions((prevGroupedTransactions) => {
        const date = `${transactionDate.getDate()}.${
          transactionDate.getMonth() + 1
        }.${transactionDate.getFullYear()}`;

        const existingTransactions = prevGroupedTransactions[date] || [];
        const newTransaction = resData.newTransaction;

        const isTransactionAdded = existingTransactions.some(
          (transaction) => transaction._id === newTransaction._id
        );

        if (!isTransactionAdded) {
          return {
            ...prevGroupedTransactions,
            [date]: [...existingTransactions, newTransaction],
          };
        }

        return prevGroupedTransactions;
      });

      paymentInputRef.current.value = null;
    } catch (error) {
      console.error(error);
    }
  };

  const calculateTotalDebt = (transactions) => {
    return transactions.reduce((acc, transaction) => acc + transaction.debt, 0);
  };

  return (
    <>
      {user && (
        <>
          <h1>Korisnik: {username}</h1>
          <h1>Stanje: {debt} din</h1>
          <form className="goodsForm" onSubmit={addGoodsTransactionHandler}>
            <div>
              <label>Roba</label>
              <input type="text" required ref={goodsInputRef}></input>
            </div>
            <div>
              <label>Kolicina</label>
              <input type="number" required ref={quantityInputRef}></input>
            </div>
            <div>
              <label>Cena</label>
              <input type="number" required ref={priceInputRef}></input>
            </div>
            <button type="submit">Potvrdi</button>
          </form>
          <form className="paymentForm" onSubmit={addPaymentTransactionHandler}>
            <div>
              <label>Uplata</label>
              <input type="number" required ref={paymentInputRef}></input>
            </div>
            <div>
              <label>Dodatne informacije</label>
              <input></input>
            </div>
            <button type="submit">Potvrdi</button>
          </form>
          <div className="hrefs">
            <Link to="/admin/allUsers" className="main-page">
              MAIN PAGE
            </Link>
            <form className="deleteForm">
              <button className="delete-profile" onClick={deleteUserHandler}>
                OBRISI PROFIL
              </button>
            </form>
            <Link to="/admin/transactions" className="all-transactions">
              SVE TRANSAKCIJE
            </Link>
          </div>
          <div className="user-transactions">
            {Object.entries(groupedTransactions).map(([date, transactions]) => {
              if (transactions.length > 0) {
                return (
                  <div className="day-separation" key={date}>
                    <header>
                      <p>{date}</p>
                    </header>
                    {transactions.map((transaction) => (
                      <div className="user-transaction" key={transaction._id}>
                        {transaction.hasOwnProperty("goods") ? (
                          <div className="goodsUserTransaction">
                            <p>Roba: {transaction.goods}</p>
                            <p>Cena: {transaction.price} din</p>
                            <p>Kolicina: {transaction.quantity} x</p>
                            <p>Dug: {transaction.debt} din</p>
                            <button
                              onClick={(e) =>
                                deleteTransactionHandler(e, {
                                  id: transaction._id,
                                })
                              }
                            >
                              OBRISI
                            </button>
                          </div>
                        ) : (
                          <div className="paymentUserTransaction">
                            <p>Uplata</p>
                            <p></p>
                            <p>{transaction.price} din</p>
                            <p></p>
                            <button
                              onClick={(e) =>
                                deleteTransactionHandler(e, {
                                  id: transaction._id,
                                })
                              }
                            >
                              OBRISI
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    <footer>
                      <p>Dug za ovaj dan: {calculateTotalDebt(transactions)}</p>
                    </footer>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </>
      )}
    </>
  );
};

export default UserProfile;
