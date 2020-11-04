import React, { useEffect, useState } from "react";
import { Container, Row, Table, Spinner } from "react-bootstrap";

const PatientAccounts = () => {
  //state hook for doctors list
  const [list, setList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const getPatientAccounts = () => {
    setList([]);
    let token = localStorage.getItem("auth-token");
    try {
      fetch("/admin/getPatients", {
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
    return list.map((patient) => {
      const { _id, firstName, lastName, email, address } = patient;
      return (
        <tr key={_id}>
          <td>{lastName + ", " + firstName}</td>
          <td>
            {address.street + ", " + address.city + ", " + address.province}
          </td>
          <td>{email}</td>
        </tr>
      );
    });
  };

  useEffect(() => {
    getPatientAccounts();
  }, []);

  return (
    <>
      <Container className="p-5">
        <Row className="justify-content-between">
          <h3>List of Appointments:</h3>
        </Row>
        {isLoaded ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
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
    </>
  );
};

export default PatientAccounts;
