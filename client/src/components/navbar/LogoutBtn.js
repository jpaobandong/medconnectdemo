import React, { useContext } from "react";
import { Button, Dropdown } from "react-bootstrap";
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
      <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
    </>
  );
};

export default LogoutButton;
