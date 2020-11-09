import React, { useState } from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import LoginModal from "../modals/LoginModal";
import RegisterModal from "../modals/RegisterModal";

const GuestNav = () => {
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
      <Navbar bg="primary" expand="lg" variant="dark">
        <Navbar.Brand href="/">MedConnect</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto"></Nav>
          <Nav className="end">
            <Button onClick={toggleLogin}>Login</Button>
            <Container></Container>
            <Button onClick={toggleReg}>Register</Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <LoginModal
        show={showLogin}
        toggle={toggleLogin}
        history={hist}
      ></LoginModal>
      <RegisterModal
        show={showReg}
        toggle={toggleReg}
        history={hist}
      ></RegisterModal>
    </>
  );
};
export default GuestNav;
