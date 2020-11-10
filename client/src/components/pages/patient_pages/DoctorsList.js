import React, { useState, useEffect } from "react";
import { Container, Table, Row, Spinner } from "react-bootstrap";

const DoctorsList = () => {
  //state hook for doctors list
  const [list, setList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const getDoctorsList = () => {
    let token = localStorage.getItem("auth-token");
    try {
      fetch("/api/patient/getDoctors", {
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
          <td>{"Rm. " + address.roomNumber + ", " + address.building}</td>
          <td>{email}</td>
        </tr>
      );
    });
  };

  useEffect(() => {
    getDoctorsList();
  }, []);

  return (
    <>
      <Container className="p-5">
        <h3>List of Doctors: </h3>
        {isLoaded ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Office</th>
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

export default DoctorsList;
