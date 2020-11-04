import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import UserContext from "../../context/UserContext";

const LogoutButton = (props) => {
  const { setUserData } = useContext(UserContext);

  const logout = () => {
    setUserData({
      token: null,
      user: null,
    });
    localStorage.setItem("auth-token", "");
    props.history.push("/");
  };

  return (
    <>
      <Button onClick={logout}>Logout</Button>
    </>
  );
};

export default LogoutButton;
