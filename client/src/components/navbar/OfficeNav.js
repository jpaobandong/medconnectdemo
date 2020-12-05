import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import LogoutButton from "./LogoutBtn";
import UserContext from "../../context/UserContext";
import { Nav, Logo, Hamburger, Menu, MenuLink } from "../../StyledComps";
import styled from "styled-components";

const OfficeNav = () => {
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
          <MenuLink to="/office/appointments">My Appointments</MenuLink>
          <MenuLink to="/office/records">My Records</MenuLink>
          <MenuLink to="/office/profile">My Profile</MenuLink>
          <LogoutButton history={hist} />
        </Menu>
      </Nav>
      {/* <Navbar bg="primary" expand="lg" variant="dark">
        <Link to="/office">
          <Navbar.Brand>MedConnect</Navbar.Brand>
        </Link>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav
            className="mr-auto"
            onSelect={(selectedKey) => {
              hist.push("/office/" + selectedKey);
            }}
          >
            <Nav.Item>
              <Nav.Link eventKey="appointments">Appointments</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="records">Records</Nav.Link>
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
                  hist.push(`/office/profile`);
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

export default OfficeNav;
