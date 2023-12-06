import { useEffect } from "react";

useEffect(() => {
  fetch("http://localhost:8080/user/transactions", {
    credentials: "include",
  })
    .then((res) => res.json())
    .then((resData) => {
      console.log(resData);
    });
}, []); 
