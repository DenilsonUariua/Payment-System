import React, { useEffect, useContext } from "react";
import { UserContext } from "../../use-context/UserContext";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    return () => {
      setUser(null);
      localStorage.removeItem("user");
      navigate("/");
    };
  }, []);

  return <div>Logging out...</div>;
};

export default Logout;
