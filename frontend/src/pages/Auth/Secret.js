import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Secret(props) {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/auth/status", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.isAuthenticated) {
          props.setRole(null);
          navigate("/login");
        } else {
          if (data.isAuthenticated) {
            if (data.isAdmin) {
              props.setRole("admin");
              navigate("/admin/allUsers");
            } else {
              props.setRole("user");
              navigate("/main");
            }
          }
        }
      });
  }, [navigate]);
}
