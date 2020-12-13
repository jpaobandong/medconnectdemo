import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Nav, Logo, Hamburger, Menu, MenuLink } from "../../StyledComps";

const GuestNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setLogin] = useState(false);
  const [showReg, setReg] = useState(false);
  const hist = useHistory();
  const toggleLogin = () => {
    setLogin(!showLogin);
  };
  const toggleReg = () => {
    setReg(!showReg);
  };

  return (
    <>
      <Nav className="navbar navbar-expand-lg">
        <Logo className="navbar-brand">
          Med<span>Connect</span>
        </Logo>
        <Hamburger onClick={() => setIsOpen(!isOpen)}>
          <span />
          <span />
          <span />
        </Hamburger>
        <Menu isOpen={isOpen}>
          <MenuLink to="/">Home</MenuLink>
          <MenuLink to="/contact">Contact</MenuLink>
          <MenuLink to="/verification">Verify</MenuLink>
        </Menu>
      </Nav>
    </>
  );
};

export default GuestNav;
