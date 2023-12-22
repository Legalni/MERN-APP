import { useEffect, useState } from "react";
import "./Transactions.css";
import { Link } from "react-router-dom";

const Transactions = () => {
  const [groupedTransactions, setGroupedTransactions] = useState({});

  useEffect(() => {
    fetch("http://localhost:8080/admin/transactions", {
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        const newGroupedTransactions = {};

        resData.transactions.forEach((transaction) => {
          const date = transaction.createdAt;

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
  }, []);

  const calculateDayDebt = (transactions) => {
    return transactions.reduce((acc, transaction) => acc + transaction.debt, 0);
  };

  return (
    <>
      {groupedTransactions && (
        <>
          <div className="transactions-header">
            <h1>SVE TRANSAKCIJE</h1>
            <Link to="/admin/allUsers">POCETNA STRANA</Link>
          </div>
          <div className="transactions">
            {Object.entries(groupedTransactions).map(([date, transactions]) => {
              if (transactions.length > 0) {
                return (
                  <div className="day-separation" key={date}>
                    <header>
                      <p>{date}</p>
                    </header>
                    {transactions.map((transaction) => {
                      return transaction.hasOwnProperty("goods") ? (
                        <div
                          className="goodsTransactions"
                          key={transaction._id}
                        >
                          <p>{transaction.creator}</p>
                          <p>Roba: {transaction.goods}</p>
                          <p>Cena: {transaction.price} din</p>
                          <p>Kolicina: {transaction.quantity} x</p>
                          <p>Datum: {transaction.createdAt}</p>
                        </div>
                      ) : (
                        <div
                          className="paymentTransactions"
                          key={transaction._id}
                        >
                          <p>{transaction.creator}</p>
                          <p>Uplata</p>
                          <p>{transaction.price} din</p>
                          <p>Datum: {transaction.createdAt}</p>
                        </div>
                      );
                    })}
                    <footer>
                      <p>Dug za ovaj Dan: {calculateDayDebt(transactions)}</p>
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

export default Transactions;
