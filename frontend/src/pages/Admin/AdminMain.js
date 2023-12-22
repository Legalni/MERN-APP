import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./AdminMain.css";
import { useAuth } from "../../context/auth-context";

const AdminMain = () => {
  const ctx = useAuth();

  const { navigate } = ctx;

  const [isShown, setIsShown] = useState(false);
  const [users, setUsers] = useState([]);
  const [hasRequests, setHasRequests] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [transactionEvent, setTransactionEvent] = useState("none");
  const usernameRef = useRef();
  const goodsRef = useRef();
  const quantityRef = useRef();
  const priceRef = useRef();

  useEffect(() => {
    fetch("http://localhost:8080/admin/main", {
      credentials: "include",
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Ne moze fetchovati usera.");
        }
        return res.json();
      })
      .then((resData) => {
        setUsers([...new Set(resData.users)]);

        const userHasRequests = resData.users.some(
          (user) => user.requests.length > 0
        );
        setHasRequests(userHasRequests);
        if (userHasRequests && !isShown) {
          const intervalId = setInterval(() => {
            setIsExpanded((prevExpanded) => !prevExpanded);
          }, 1500);

          return () => clearInterval(intervalId);
        }
      })
      .catch((err) => console.log("nece fetch"));
  }, []);

  const showRequestsHandler = (event) => {
    event.preventDefault();

    setIsShown((prevState) => !prevState);
  };

  const addUserHandler = (event) => {
    event.preventDefault();

    const username = usernameRef.current.value;
    const goods = goodsRef.current.value;
    const quantity = quantityRef.current.value;
    const price = priceRef.current.value;

    const doesUserExist = users.some((user) => user.username === username);

    fetch("http://localhost:8080/admin/post-add-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        goods,
        quantity,
        price,
      }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((resData) => {
        if (!doesUserExist) {
          setUsers((prevUsers) => [
            ...prevUsers,
            {
              _id: `${resData.userId}`,
              username,
            },
          ]);
        }
      })
      .then(() => {
        usernameRef.current.value = null;
        goodsRef.current.value = null;
        quantityRef.current.value = null;
        priceRef.current.value = null;
      });
  };

  const acceptRequestHandler = (data) => {
    fetch("http://localhost:8080/admin/add-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: data._id,
        username: data.username,
        goods: data.goods,
        quantity: data.quantity,
        price: data.price,
      }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((resData) => {
        setTransactionEvent("accepted");

        setTimeout(() => {
          setUsers((prevUsers) => {
            const updatedUsers = prevUsers.map((user) => {
              user.requests = user.requests.filter((request) => {
                return (
                  request._id.toString() !== resData.transactionId.toString()
                );
              });
              return user;
            });
            return updatedUsers;
          });
          setTransactionEvent("none");
          setTimeout(() => {
            setHasRequests(users.some((user) => user.requests.length > 0));
          }, 100);
        }, 500);
      });
  };

  const rejectRequestHandler = (data) => {
    console.log(data.username);

    fetch(`http://localhost:8080/admin/reject-request/${data._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: data.username }),
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        setTransactionEvent("rejected");

        setTimeout(() => {
          setUsers((prevUsers) => {
            const updatedUsers = prevUsers.map((user) => {
              user.requests = user.requests.filter((request) => {
                return (
                  request._id.toString() !== resData.transactionId.toString()
                );
              });
              return user;
            });
            return updatedUsers;
          });
          setTransactionEvent("none");
          setTimeout(() => {
            setHasRequests(users.some((user) => user.requests.length > 0));
          }, 100);
        }, 500);
      });
  };

  const adminLogoutHandler = (event) => {
    event.preventDefault();

    fetch(`http://localhost:8080/admin/logout`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => {
        navigate("/admin/login");
      })
      .catch((err) => console.log("Ne mozete se izlogovati"));
  };

  return (
    <>
      {users && (
        <>
          <div className="progress-bar">
            <div
              className="progress-bar-value"
              style={{ width: hasRequests && !isShown ? "200%" : "0%" }}
            ></div>
          </div>
          <div className="logout">
            <button onClick={adminLogoutHandler}>Odjavi se</button>
          </div>
          <div className="show-requests">
            <button
              className={`${
                hasRequests && !isShown && isExpanded ? "expanded" : ""
              }`}
              onClick={showRequestsHandler}
            >
              Prikazi zahteve
            </button>
          </div>
          {isShown && (
            <div
              className={`requestsContainer ${
                transactionEvent === "accepted" ? "accepted" : ""
              } ${transactionEvent === "rejected" ? "rejected" : ""}`}
            >
              <h1>Zahtevi:</h1>
              <div className="requestsList">
                {users.map((user) => {
                  return (
                    <React.Fragment key={user._id}>
                      {user.requests.map((request) => {
                        return request.hasOwnProperty("goods") ? (
                          <div key={request._id} className="goodsRequest">
                            <p>{user.username}</p>
                            <p>{request.goods}</p>
                            <p>{request.quantity} x</p>
                            <p>{request.price} din</p>
                            <button
                              className="confirmRequest"
                              onClick={() =>
                                acceptRequestHandler({
                                  username: user.username,
                                  goods: request.goods,
                                  quantity: request.quantity,
                                  price: request.price,
                                  _id: request._id,
                                })
                              }
                            >
                              ✔️
                            </button>
                            <button
                              type="submit"
                              className="declineRequest"
                              onClick={() =>
                                rejectRequestHandler({
                                  username: user.username,
                                  _id: request._id,
                                })
                              }
                            >
                              ❌
                            </button>
                          </div>
                        ) : (
                          <div key={request._id} className="paymentRequest">
                            <p>{user.username}</p>
                            <p>uplata</p>
                            <p>uplata</p>
                            <p>{request.price} din</p>
                            <button
                              className="confirmRequest"
                              onClick={() =>
                                acceptRequestHandler({
                                  username: user.username,
                                  price: request.price,
                                  _id: request._id,
                                })
                              }
                            >
                              ✔️
                            </button>
                            <button
                              className="declineRequest"
                              onClick={() =>
                                rejectRequestHandler({
                                  username: user.username,
                                  _id: request._id,
                                })
                              }
                            >
                              ❌
                            </button>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
          <form className="user-form" onSubmit={addUserHandler}>
            <div>
              <label>Ime</label>
              <input ref={usernameRef} required />
            </div>
            <div>
              <label>Roba</label>
              <input ref={goodsRef} required />
            </div>
            <div>
              <label>Kolicina</label>
              <input ref={quantityRef} required />
            </div>
            <div>
              <label>Cena</label>
              <input ref={priceRef} required />
            </div>
            <div></div>
            <div>
              <button type="submit">Potvrdi</button>
            </div>
            <div>
              <button>
                <Link to="/admin/transactions">Transakcije</Link>
              </button>
            </div>
          </form>
          <div className="users">
            {users.map((user) => {
              return (
                <Link
                  className="user"
                  key={user._id}
                  to={`/admin/user/${user.username}`}
                >
                  {user.username}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default AdminMain;
