import React, { useState, useContext } from "react";
import { Navbar, Nav, Dropdown, DropdownButton } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import LogoutButton from "./LogoutBtn";
import UserContext from "../../context/UserContext";

const OfficeNav = () => {
  const hist = useHistory();
  const { userName } = useContext(UserContext);
  const [show, setShow] = useState(false);

  const onMenuClick = () => {
    setShow(!show);
  };

  const hide = (e) => {
    if (e && e.relatedTarget) {
      e.relatedTarget.click();
    }
    setShow(false);
  };

  return (
    <>
      <Navbar bg="primary" expand="lg" variant="dark">
        <Navbar.Brand
          href="#"
          onClick={() => {
            hist.push("/office");
          }}
        >
          MedConnect
        </Navbar.Brand>
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
      </Navbar>
    </>
  );
};

export default OfficeNav;
