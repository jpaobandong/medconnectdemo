import React, { useContext, useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import UserContext from "../../context/UserContext";

const LoginModal = (props) => {
  const { setUserData, setUserName } = useContext(UserContext);
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

  const getName = (giventoken, givenid) => {
    try {
      fetch(`/api/patient/getName/${givenid}`, {
        method: "GET",
        headers: {
          "x-auth-token": giventoken,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.msgError) {
            console.log(data.msg.body);
          } else {
            setUserName(`${data.user[0].firstName} ${data.user[0].lastName}`);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getDoctorName = (giventoken, givenid) => {
    try {
      fetch(`/api/office/getName/${givenid}`, {
        method: "GET",
        headers: {
          "x-auth-token": giventoken,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.msgError) {
            console.log(data.msg.body);
          } else {
            setUserName(
              `Dr. ${data.user[0].firstName} ${data.user[0].lastName}`
            );
          }
        });
    } catch (error) {
      console.log(error);
    }
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
        await fetch("/api/auth/login", {
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
                  getName(data.token, data.user.id);
                  props.toggle();
                  props.history.push("/patient/");
                  break;
                case "admin":
                  setUserName("Admin");
                  props.toggle();
                  props.history.push("/admin/");
                  break;
                case "office":
                  getDoctorName(data.token, data.user.id);
                  props.toggle();
                  props.history.push("/office");
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
