import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./AdminMain.css";

const AdminMain = (props) => {
  const [isShown, setIsShown] = useState(false);
  const [users, setUsers] = useState([]);
  const [hasRequests, setHasRequests] = useState(false);
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
        console.log(resData);
        setUsers([...new Set(resData.users)]);

        const userHasRequests = resData.users.some(
          (user) => user.requests.length > 0
        );
        setHasRequests(userHasRequests);
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

    fetch("http://localhost:8080/admin/add-user", {
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
    console.log(data);

    fetch("http://localhost:8080/admin/add-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data.username,
        goods: data.goods,
        quantity: data.quantity,
        price: data.price,
      }),
      credentials: "include",
    }).then((res) => res.json());
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
            <button
              onClick={(e) => {
                props.onLogout(e, true);
              }}
            >
              Odjavi se
            </button>
          </div>
          <div className="show-requests">
            <button
              className={`${hasRequests && !isShown && "expanded"}`}
              onClick={showRequestsHandler}
            >
              Prikazi zahteve
            </button>
          </div>
          {isShown && (
            <div className="requestsContainer">
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
                                })
                              }
                            >
                              ✔️
                            </button>
                            <button
                              type="submit"
                              className="declineRequest"
                              // onClick={declineRequestHandler}
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
                            <button className="confirmRequest">✔️</button>
                            <button className="declineRequest">❌</button>
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
                <div className="user" key={user._id}>
                  <Link to={`/admin/user/${user.username}`}>
                    {user.username}
                  </Link>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default AdminMain;
