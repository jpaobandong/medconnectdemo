import React, { useState, useEffect } from "react";
import { Container, Table, Row, Spinner, Button } from "react-bootstrap";
import NewOfficeModal from "../../modals/NewOfficeModal";

const OfficeAccounts = () => {
  //state hook for doctors list
  const [list, setList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const getDoctorsList = () => {
    setList([]);
    let token = localStorage.getItem("auth-token");
    try {
      fetch("/api/admin/getOffices", {
        method: "GET",
        headers: {
          "x-auth-token": token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.msgError) {
            console.log(data.msg);
          } else {
            data.list.map((e) => {
              return setList((oldList) => [...oldList, e]);
            });
          }
          setIsLoaded(true);
        });
    } catch (err) {
      console.log(err.response);
    }
  };

  const loadTable = () => {
    return list.map((office) => {
      const { _id, firstName, lastName, email, address } = office;
      return (
        <tr key={_id}>
          <td>{lastName + ", " + firstName}</td>
          <td>
            {"Rm. " +
              address.roomNumber +
              ", " +
              address.building +
              ", " +
              address.street +
              ", " +
              address.city +
              ", " +
              address.province}
          </td>
          <td>{email}</td>
        </tr>
      );
    });
  };

  const toggleMod = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    getDoctorsList();
  }, []);

  return (
    <>
      <Container className="p-5">
        <Row className="justify-content-between">
          <h3>Office Accounts:</h3>
          <Button variant="link" onClick={toggleMod}>
            Add an Office Account
          </Button>
        </Row>
        {isLoaded ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Office Address</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>{loadTable()}</tbody>
          </Table>
        ) : (
          <Container>
            <Row className="justify-content-md-center p-5">
              <Spinner animation="border" />
              Loading...
            </Row>
          </Container>
        )}
      </Container>

      <NewOfficeModal
        show={showModal}
        toggle={toggleMod}
        reloadList={getDoctorsList}
      />
    </>
  );
};
export default OfficeAccounts;
