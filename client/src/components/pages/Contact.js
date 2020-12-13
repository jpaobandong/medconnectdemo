import { AccordionDetails, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useState } from "react";
import { Col, Row, Form } from "react-bootstrap";
import styled from "styled-components";
import { LoginButton } from "../../StyledComps";
import Footer from "../Footer";

const Contact = () => {
  const [details, setDetails] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [disabled, setDisabled] = useState(false);

  const [alert, setAlert] = useState({
    content: "",
    show: false,
    variant: "error",
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert({ ...alert, show: false });
  };

  const onChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const sendMsg = () => {
    setDisabled(true);
    if (
      details.name === "" ||
      details.email === "" ||
      details.subject === "" ||
      details.message === ""
    ) {
      setDisabled(true);
      setAlert({
        show: true,
        content: "All Fields Required",
        variant: "error",
      });
    } else {
      try {
        fetch("/api/auth/sendMsg", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(details),
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            setDetails({
              name: "",
              email: "",
              subject: "",
              message: "",
            });
            setDisabled(false);
            setAlert({
              content: data.msg.body,
              show: true,
              variant: "success",
            });
          });
      } catch (error) {
        setDisabled(false);
        setAlert({
          show: true,
          content: "Server Error: " + error,
          variant: "error",
        });
      }
    }
  };

  return (
    <>
      <Container>
        <Row>
          <Image src="https://i.ibb.co/s31416m/contactus.jpg" alt="contactus" />

          <Col>
            <FormContainer>
              <Title>We would like to hear from you! </Title>
              <Input
                placeholder="Name"
                name="name"
                value={details.name}
                onChange={onChange}
              />
              <Input
                placeholder="Email"
                type="email"
                name="email"
                value={details.email}
                onChange={onChange}
              />
              <Input
                placeholder="Subject"
                name="subject"
                value={details.subject}
                onChange={onChange}
              />
              <StyledTextAreaLarge
                value={details.message}
                onChange={onChange}
                name="message"
                row={3}
                as="textarea"
                type="text"
                placeholder="Message"
              />
              <Row className="justify-content-end">
                <Button
                  disabled={disabled}
                  onClick={() => {
                    sendMsg();
                  }}
                >
                  Send
                </Button>
              </Row>
            </FormContainer>
          </Col>
        </Row>

        <Snackbar
          open={alert.show}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            severity={alert.variant}
            onClose={handleClose}
            elevation={6}
            variant="filled"
          >
            {alert.content}
          </Alert>
        </Snackbar>
      </Container>
      <Footer />
    </>
  );
};

export default Contact;

const Container = styled.div`
  padding: 2rem 1rem;
`;

const Image = styled.img`
  min-width: 100px;
  max-width: 700px;
`;

const FormContainer = styled.div`
  border-radius: 10px;
  padding: 10px;
  max-width: 500px;
  max-height: 800px;
  /* border: 2px solid #4886af; */
  border-radius: 1-px;
`;

const Input = styled.input`
  margin-bottom: 20px;
  width: 100%;
  border: 2px solid #83c1e8;
  border-radius: 10px;
  padding: 0.5rem;
  font-size: 0.9rem;
  &:focus {
    outline: none;
    border: 2px solid #4886af;
  }
`;

const StyledTextAreaLarge = styled(Form.Control)`
  min-height: 8rem;
  min-width: 100%;
  resize: none;
  margin-bottom: 20px;
  width: 100%;
  border: 2px solid #83c1e8;
  border-radius: 10px;
  padding: 0.5rem;
  font-size: 0.9rem;
  &:focus {
    outline: none;
    border: 2px solid #4886af;
  }
`;

const Title = styled.h4`
  color: #4886af;
  padding: 0.8rem 0.2rem;
  font-size: 1.5rem;
`;

const Button = styled(LoginButton)`
  margin: 0px 15px;
  max-width: 100px;
  background-color: #4886af;
  color: white;
  &:hover {
    background-color: #83c1e8;
    color: #ffffff;
  }
`;
