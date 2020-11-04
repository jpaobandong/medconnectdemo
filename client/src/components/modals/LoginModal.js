import React, { useContext, useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import UserContext from "../../context/UserContext";

const LoginModal = (props) => {
  const { setUserData } = useContext(UserContext);
  const [credentials, setUserCredentials] = useState({
    email: "",
    password: "",
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

  //event handler of submit button
  const onClickSubmit = async (e) => {
    e.preventDefault();
    const data = { email: credentials.email, password: credentials.password };
    setAlertContent({
      content: "",
      show: false,
      variant: "danger",
    });

    try {
      //verify if the fields are empty
      if (credentials.email === "" || credentials.password === "") {
        setAlertContent({
          show: true,
          content: "All fields required!",
          variant: "danger",
        });
        return false;
      } else {
        await fetch("/auth/login", {
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
              if (data.notVerified) {
                setTimeout(() => {
                  props.history.push("/verification");
                  props.toggle();
                }, 3000);
              }
            } else {
              //---------save token to local storage (change in the future)------------------
              localStorage.setItem("auth-token", data.token);
              //---------update user context to the logged in user------------------
              setUserData({
                token: data.token,
                user: data.user,
              });
              switch (data.user.role) {
                case "patient":
                  props.toggle();
                  props.history.push("/appointments");
                  break;
                case "admin":
                  props.toggle();
                  props.history.push("/accounts");
                  break;
                case "office":
                  props.toggle();
                  props.history.push("/appointmentstoday");
                  break;
                default:
                  props.toggle();
                  props.history.push("/");
              }
              //redirect to patients appointments
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

  //reset form and alert when the user clicks close
  const onClickClose = () => {
    setUserCredentials({
      email: "",
      password: "",
    });
    setAlertContent({
      content: "",
      show: false,
      variant: "danger",
    });
    props.toggle();
  };

  return (
    <Modal show={props.show} backdrop="static">
      <Modal.Header>Login</Modal.Header>
      <Modal.Body>
        <Form>
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
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={onChange}
              value={credentials.password}
              name="password"
            />
          </Form.Group>
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
export default LoginModal;
