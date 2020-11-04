import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";

const Verification = () => {
  const [credentials, setUserCredentials] = useState({
    email: "",
    vCode: "",
  });

  const [alertContent, setAlertContent] = useState({
    content: "",
    show: false,
    variant: "danger",
  });

  //change the value of credentials hook on change of field inpu
  const onChange = (e) => {
    setUserCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const onClickSubmit = async (e) => {
    e.preventDefault();

    setAlertContent({
      content: "",
      show: false,
      variant: "danger",
    });

    try {
      //verify if the fields are empty
      if (credentials.email === "" || credentials.vCode === "") {
        setAlertContent({
          show: true,
          content: "All fields required!",
          variant: "danger",
        });
        return false;
      } else {
        await fetch("/auth/verifyAccount", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (data.msgError) {
              setAlertContent({
                content: data.msg.body,
                show: true,
                variant: "danger",
              });
            } else {
              setAlertContent({
                content: data.msg.body,
                show: true,
                variant: "success",
              });
            }
          });
      }
    } catch (err) {
      setAlertContent({
        content: "Cannot connect to server",
        show: true,
        variant: "danger",
      });
    }
  };

  return (
    <Container className="p-5" fluid="sm">
      <Row className="justify-content-center">
        <Col lg={4} md={6} sm={8}>
          <h3>Verify account</h3>
          <Form className="mt-4">
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={onChange}
                value={credentials.email}
                name="email"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Verification Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter code"
                onChange={onChange}
                value={credentials.vCode}
                name="vCode"
              />
            </Form.Group>
            <Alert show={alertContent.show} variant={alertContent.variant}>
              {alertContent.content}
            </Alert>
            <Button variant="primary" onClick={onClickSubmit}>
              Verify
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Verification;
