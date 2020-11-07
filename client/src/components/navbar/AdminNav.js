import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import LogoutButton from "./LogoutBtn";

const AdminNav = () => {
  const hist = useHistory();

  return (
    <>
      <Navbar bg="primary" expand="lg" variant="dark">
        <Navbar.Brand>MedConnect</Navbar.Brand>
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
            <LogoutButton history={hist} />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default AdminNav;
