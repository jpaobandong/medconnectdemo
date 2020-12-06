import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import LogoutButton from "./LogoutBtn";
import UserContext from "../../context/UserContext";
import { Nav, Logo, Hamburger, Menu, MenuLink } from "../../StyledComps";
import styled from "styled-components";

const PatientNav = () => {
  const hist = useHistory();
  const { userName } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Nav className="navbar navbar-expand-lg">
        <Logo className="navbar-brand">
          Med<span>Connect | {userName}</span>
        </Logo>
        <Hamburger onClick={() => setIsOpen(!isOpen)}>
          <span />
          <span />
          <span />
        </Hamburger>
        <Menu isOpen={isOpen}>
          <MenuLink to="/">Dashboard</MenuLink>
          <MenuLink to="/patient/appointments">My Appointments</MenuLink>
          <MenuLink to="/patient/records">My Records</MenuLink>
          <MenuLink to="/patient/profile">My Profile</MenuLink>
          <LogoutButton history={hist} />
        </Menu>
      </Nav>
      {/*  <Navbar bg="primary" expand="lg" variant="dark">
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
              onBlur={hide}
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
            
          </Nav>
        </Navbar.Collapse>
      </Navbar> */}
    </>
  );
};

export default PatientNav;

const DropdownDiv = styled.div``;

const DropdownButton = styled.button`
  padding: 1rem 2rem;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  font-size: 0.9rem;
  color: #ffffff;
  background-color: transparent;
  border: 5px solid transparent;
  &:hover {
    text-decoration: none;
    color: #073245;
  }
`;

const DropdownMenu = styled.div``;

const DropdownItem = styled.a``;
