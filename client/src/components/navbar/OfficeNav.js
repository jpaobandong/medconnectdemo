import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { useHistory, useRouteMatch } from "react-router-dom";
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
            defaultActiveKey="appointmentstoday"
            className="mr-auto"
            onSelect={(selectedKey) => {
              hist.push("/" + selectedKey);
            }}
          >
            <Nav.Item>
              <Nav.Link eventKey="appointmentstoday">Appointments</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="recordslist">Records</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="patientlist">Patients</Nav.Link>
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
