import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import LogoutButton from "./LogoutBtn";
import { Nav, Logo, Hamburger, Menu, MenuLink } from "../../StyledComps";

const AdminNav = () => {
  const hist = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);

  return (
    <>
      <Nav className="navbar navbar-expand-lg">
        <Logo className="navbar-brand">
          Med<span>Connect | Admin</span>
        </Logo>
        <Hamburger onClick={() => setIsOpen(!isOpen)}>
          <span />
          <span />
          <span />
        </Hamburger>
        <Menu isOpen={isOpen}>
          <MenuLink to="/admin">Dashboard</MenuLink>
          <MenuLink to="/admin/accounts">Patient Accounts</MenuLink>
          <MenuLink to="/admin/offices">Doctor Accounts</MenuLink>
          <LogoutButton history={hist} />
        </Menu>
      </Nav>
      {/* <Navbar bg="primary" expand="lg" variant="dark">
        <Navbar.Brand
          href="#"
          onClick={() => {
            hist.push("/admin");
          }}
        >
          MedConnect
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav
            defaultActiveKey="/admin/accounts"
            className="mr-auto"
            onSelect={(selectedKey) => {
              hist.push("/admin/" + selectedKey);
            }}
          >
            <Nav.Item>
              <Nav.Link eventKey="accounts">Patients</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="offices">Offices</Nav.Link>
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
              
              <Dropdown.Divider />
              <LogoutButton history={hist} />
            </DropdownButton>
          </Nav>
        </Navbar.Collapse>
      </Navbar> */}
    </>
  );
};

export default AdminNav;
