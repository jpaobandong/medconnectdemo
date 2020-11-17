import React, { useState, useContext, useEffect } from "react";
import { Navbar, Nav, Dropdown, DropdownButton } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import LogoutButton from "./LogoutBtn";
import UserContext from "../../context/UserContext";

const PatientNav = () => {
  const hist = useHistory();
  const { userName } = useContext(UserContext);
  const [show, setShow] = useState(false);

  const onMenuClick = () => {
    setShow(!show);
  };

  return (
    <>
      <Navbar bg="primary" expand="lg" variant="dark">
        <Navbar.Brand
          href="#"
          onClick={() => {
            hist.push("/patient");
          }}
        >
          MedConnect
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav
            className="mr-auto"
            onSelect={(selectedKey) => {
              hist.push("/patient" + selectedKey);
            }}
          >
            <Nav.Item>
              <Nav.Link eventKey="/appointments">My Appointments</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="/records">My Records</Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav className="end">
            <DropdownButton
              show={show}
              onClick={onMenuClick}
              menuAlign="right"
              title={userName}
              id="dropdown-menu-align-right"
            >
              <Dropdown.Item
                onClick={() => {
                  hist.push(`/patient/profile`);
                }}
              >
                My Account
              </Dropdown.Item>
              <Dropdown.Divider />
              <LogoutButton history={hist} />
            </DropdownButton>
            {/*  */}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default PatientNav;
