import React, { useState } from "react";
import { Modal, Button, Form, Alert, Col } from "react-bootstrap";
import DatePicker from "react-date-picker";

const RegisterModal = (props) => {
  const [fields, setFields] = useState({
    email: "",
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    province: "",
    password: "",
    confirm: "",
  });
  const [birthdate, setBirthdate] = useState(null);

  const [alertContent, setAlertContent] = useState({
    content: "",
    show: false,
    variant: "danger",
  });

  //change the value of fields hook on change of field inpu
  const onChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const sendToServer = async () => {
    const data = { fields, birthdate };
    try {
      await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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

            /*TODO: REDIRECT TO VERIFY EMAIL PAGE*/
          }
        });
    } catch (err) {
      console.log(err);
      /* setAlertContent({
        content: err.msg,
        show: true,
        variant: "danger",
      }); */
    }
  };

  //event handler of submit button
  const onClickSubmit = (e) => {
    e.preventDefault();

    setAlertContent({
      content: "",
      show: false,
      variant: "danger",
    });

    //verify if the fields are empty
    if (
      fields.email === "" ||
      fields.password === "" ||
      fields.firstName === "" ||
      fields.lastName === "" ||
      fields.street === "" ||
      fields.city === "" ||
      fields.province === "" ||
      fields.confirm === "" ||
      birthdate === null
    ) {
      if (birthdate === null) {
        setAlertContent({
          show: true,
          content: "Please select birthdate!",
          variant: "danger",
        });
        return false;
      }
      if (fields.password !== fields.confirm) {
        setAlertContent({
          show: true,
          content: "Passwords do not match!",
          variant: "danger",
        });
        return false;
      } else {
        setAlertContent({
          show: true,
          content: "All fields required!",
          variant: "danger",
        });
        return false;
      }
    } else {
      sendToServer();
    }
  };

  //reset form and alert when the user clicks close
  const onClickClose = () => {
    setFields({
      email: "",
      firstName: "",
      lastName: "",
      street: "",
      city: "",
      province: "",
      password: "",
      confirm: "",
    });
    setBirthdate(null);
    setAlertContent({
      content: "",
      show: false,
      variant: "danger",
    });
    props.toggle();
  };

  return (
    <Modal show={props.show} backdrop="static">
      <Modal.Header>Register</Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Juan"
                  onChange={onChange}
                  value={fields.firstName}
                  name="firstName"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Dela Cruz"
                  onChange={onChange}
                  value={fields.lastName}
                  name="lastName"
                />
              </Form.Group>
            </Col>
          </Form.Row>

          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label className="mr-3">Birthdate</Form.Label>
                <DatePicker
                  onChange={setBirthdate}
                  value={birthdate}
                  maxDate={new Date()}
                />
              </Form.Group>
            </Col>
          </Form.Row>

          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  onChange={onChange}
                  value={fields.email}
                  name="email"
                />
              </Form.Group>
            </Col>
          </Form.Row>
          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={onChange}
                  value={fields.password}
                  name="password"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  onChange={onChange}
                  value={fields.confirm}
                  name="confirm"
                />
              </Form.Group>
            </Col>
          </Form.Row>

          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label>Street Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="101 Rizal street"
                  onChange={onChange}
                  value={fields.street}
                  name="street"
                />
              </Form.Group>
            </Col>
          </Form.Row>
          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Dagupan"
                  onChange={onChange}
                  value={fields.city}
                  name="city"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Province</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Pangasinan"
                  onChange={onChange}
                  value={fields.province}
                  name="province"
                />
              </Form.Group>
            </Col>
          </Form.Row>
        </Form>
        <Alert show={alertContent.show} variant={alertContent.variant}>
          {alertContent.content}
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClickClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onClickSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default RegisterModal;
