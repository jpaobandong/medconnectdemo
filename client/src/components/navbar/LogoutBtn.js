import React, { useContext } from "react";
import { Button, Dropdown } from "react-bootstrap";
import UserContext from "../../context/UserContext";
import { MenuLink } from "../../StyledComps";

const LogoutButton = (props) => {
  const { setUserData, setDidDeactivate, setUserName } = useContext(
    UserContext
  );

  const logout = () => {
    setUserData({
      token: null,
      user: null,
    });
    setUserName("");
    setDidDeactivate(false);
    localStorage.setItem("auth-token", "");
    props.history.push("/");
  };

  return (
    <>
      <MenuLink to="/" onClick={logout}>
        Logout
      </MenuLink>
    </>
  );
};

export default LogoutButton;
