import React, { useEffect, useContext } from "react";
import { UserContext } from "../../use-context/UserContext";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
    return () => {};
  }, [setUser, navigate]);

  return <div>Logging out...</div>;
};
