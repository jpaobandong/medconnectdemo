import React, { useState } from "react";
import { Modal, Form, Alert, Col } from "react-bootstrap";
import styled from "styled-components";
import { PrimaryButton, SecondaryButton } from "../../StyledComps";

const RegisterModal = (props) => {
  const [fields, setFields] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirm: "",
  });
  const [birthdate, setBirthdate] = useState(null);

  const [alertContent, setAlertContent] = useState({
    content: "",
    show: false,
    variant: "danger",
  });

  const [buttonContent, setButtonContent] = useState(<>Submit</>);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const toggleBtn = () => {
    if (buttonDisabled) {
      setButtonDisabled(!buttonDisabled);
      setButtonContent("Submit");
    } else {
      setButtonDisabled(!buttonDisabled);
      setButtonContent(
        <>
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Sending...
        </>
      );
    }
  };

  //change the value of fields hook on change of field inpu
  const onChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const sendToServer = async () => {
    const data = { fields, birthdate };
    try {
      await fetch("/api/auth/register", {
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
            setButtonDisabled(false);
            setButtonContent("Submit");
          } else {
            setAlertContent({
              content: data.msg.body,
              show: true,
              variant: "success",
            });

            /*TODO: REDIRECT TO VERIFY EMAIL PAGE*/
            setTimeout(() => {
              props.history.push("/verification");
              props.toggle();
              setButtonDisabled(false);
              setButtonContent("Submit");
              onClickClose();
            }, 3000);
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
      fields.confirm === ""
    ) {
      if (birthdate === null) {
        setAlertContent({
          show: true,
          content: "Please select birthdate!",
          variant: "danger",
        });

        return false;
      }
      if (fields.password.length < 8) {
        setAlertContent({
          show: true,
          content: "Passwords must be at least 8 characters long.",
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
      toggleBtn();
      sendToServer();
    }
  };

  //reset form and alert when the user clicks close
  const onClickClose = () => {
    setFields({
      email: "",
      firstName: "",
      lastName: "",
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
      <Modal.Header>
        <CardTitle>Patient Registration</CardTitle>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Row>
            <Col>
              <StyledGroup>
                <StyledInput
                  type="text"
                  placeholder="First Name"
                  onChange={onChange}
                  value={fields.firstName}
                  name="firstName"
                />
              </StyledGroup>
            </Col>
            <Col>
              <StyledGroup>
                <StyledInput
                  type="text"
                  placeholder="Last Name"
                  onChange={onChange}
                  value={fields.lastName}
                  name="lastName"
                />
              </StyledGroup>
            </Col>
          </Form.Row>

          <Form.Row>
            <Col>
              <StyledGroup>
                <StyledInput
                  type="email"
                  placeholder="Email"
                  onChange={onChange}
                  value={fields.email}
                  name="email"
                />
              </StyledGroup>
            </Col>
          </Form.Row>
          <Form.Row>
            <Col>
              <StyledGroup>
                <StyledInput
                  type="password"
                  placeholder="Password"
                  onChange={onChange}
                  value={fields.password}
                  name="password"
                />
              </StyledGroup>
            </Col>
            <Col>
              <StyledGroup>
                <StyledInput
                  type="password"
                  placeholder="Confirm Password"
                  onChange={onChange}
                  value={fields.confirm}
                  name="confirm"
                />
              </StyledGroup>
            </Col>
          </Form.Row>
        </Form>
        <Alert show={alertContent.show} variant={alertContent.variant}>
          {alertContent.content}
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        <SecondaryButton disabled={buttonDisabled} onClick={onClickClose}>
          Close
        </SecondaryButton>
        <PrimaryButton disabled={buttonDisabled} onClick={onClickSubmit}>
          {buttonContent}
        </PrimaryButton>
      </Modal.Footer>
    </Modal>
  );
};
export default RegisterModal;

const StyledLabel = styled(Form.Label)`
  color: #4886af;
`;

const StyledInput = styled(Form.Control)`
  border: none;
  border-bottom: 2px solid #83c1e8;
  padding: 0.5rem;
  font-size: 0.9rem;
  &:focus {
    outline: none;
    border-bottom: 2px solid #4886af;
  }
`;

const StyledGroup = styled(Form.Group)`
  padding: 0.5rem;
`;

const CardTitle = styled.b`
  color: #4886af;
  font-size: 1.3rem;
  font-weight: 400;
`;
