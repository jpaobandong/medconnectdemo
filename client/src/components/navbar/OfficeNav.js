import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import LogoutButton from "./LogoutBtn";

const OfficeNav = () => {
  const hist = useHistory();

  return (
    <>
      <Navbar bg="primary" expand="lg" variant="dark">
        <Navbar.Brand>MedConnect</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav
            defaultActiveKey="/office/appointments"
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
            <Nav.Item>
              <Nav.Link eventKey="patients">Patients</Nav.Link>
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

export default OfficeNav;
