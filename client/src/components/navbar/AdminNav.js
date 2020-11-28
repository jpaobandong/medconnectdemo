import React, { useContext, useState } from "react";
import { Navbar, Nav, DropdownButton, Dropdown } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import LogoutButton from "./LogoutBtn";

const AdminNav = () => {
  const { userName } = useContext(UserContext);
  const hist = useHistory();

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
              {/* <Dropdown.Item>My Account</Dropdown.Item> */}
              <Dropdown.Divider />
              <LogoutButton history={hist} />
            </DropdownButton>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default AdminNav;
