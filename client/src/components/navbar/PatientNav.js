import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { useHistory, useRouteMatch } from "react-router-dom";
import LogoutButton from "./LogoutBtn";

const PatientNav = () => {
  const hist = useHistory();

  return (
    <>
      <Navbar bg="primary" expand="lg" variant="dark">
        <Navbar.Brand href="/">MedConnect</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav
            defaultActiveKey="appointments"
            className="mr-auto"
            onSelect={(selectedKey) => {
              hist.push("/" + selectedKey);
            }}
          >
            <Nav.Item>
              <Nav.Link eventKey="appointments">Appointments</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="records">Records</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="doctorslist">Doctors</Nav.Link>
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

export default PatientNav;
