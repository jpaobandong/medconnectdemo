import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import styled from "styled-components";
import home_img from "../../img/10130.jpg";
import {
  Row,
  Image,
  Card,
  CardFooter,
  CardBody,
  LoginButton,
  Input,
  Text,
  Form,
  FormGroup,
} from "../../StyledComps";
import RegisterModal from "../modals/RegisterModal";
import { useHistory } from "react-router-dom";
import Footer from "../Footer";

const Home = () => {
  const hist = useHistory();
  const {
    setUserData,
    setUserName,
    didDeactivate,
    setDidDeactivate,
  } = useContext(UserContext);

  const [showReg, setReg] = useState(false);
  const [credentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState({
    content: "",
    show: false,
    variant: "error",
  });
  const [disabled, setDisabled] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert({ ...alert, show: false });
    setDidDeactivate(false);
  };

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
    setDisabled(true);
    e.preventDefault();
    const data = { email: credentials.email, password: credentials.password };
    setAlert({
      content: "",
      show: false,
      variant: "error",
    });

    try {
      //verify if the fields are empty
      if (credentials.email === "" || credentials.password === "") {
        setAlert({
          show: true,
          content: "All fields required!",
          variant: "error",
        });
        setDisabled(false);
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
              setDisabled(false);
              setAlert({
                content: data.msg.body,
                show: true,
                variant: "error",
              });
              if (data.notVerified) {
                setTimeout(() => {
                  hist.push("/verification");
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

                  hist.push("/patient/");
                  break;
                case "admin":
                  setUserName("Admin");

                  hist.push("/admin/");
                  break;
                case "office":
                  getDoctorName(data.token, data.user.id);

                  hist.push("/office");
                  break;
                default:
                  hist.push("/");
              }
              //redirect to patients appointments
              setDisabled(false);
            }
          });
      }
    } catch (err) {
      setDisabled(false);
      setAlert({
        content: "Cannot connect to server",
        show: true,
        variant: "error",
      });
    }
  };

  useEffect(() => {
    if (didDeactivate)
      setAlert({
        content: "Account Deactivated!",
        show: true,
        variant: "success",
      });
  }, []);

  return (
    <>
      <StyledContainer>
        <Row className="row">
          <Image alt="Home Image" className="img-fluid" src={home_img} />
          <Card className="card">
            <CardBody>
              <Form onSubmit={onClickSubmit}>
                <FormGroup>
                  <Input
                    type="email"
                    placeholder="Email"
                    onChange={onChange}
                    value={credentials.email}
                    name="email"
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="password"
                    placeholder="Password"
                    onChange={onChange}
                    value={credentials.password}
                    name="password"
                  />
                </FormGroup>
              </Form>
            </CardBody>
            <CardFooter>
              <LoginButton
                type="submit"
                disabled={disabled}
                onClick={onClickSubmit}
              >
                {disabled ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  "Login"
                )}
              </LoginButton>
              <Text>
                Don't have an account?{" "}
                <a
                  href="javascript:;"
                  onClick={() => {
                    setReg(true);
                  }}
                >
                  Sign Up!
                </a>
              </Text>
            </CardFooter>
          </Card>
        </Row>
      </StyledContainer>
      <RegisterModal
        show={showReg}
        toggle={() => {
          setReg(false);
        }}
        history={hist}
      />
      <Snackbar open={alert.show} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          severity={alert.variant}
          onClose={handleClose}
          elevation={6}
          variant="filled"
        >
          {alert.content}
        </Alert>
      </Snackbar>
      <Footer />
    </>
  );
};

export default Home;

const StyledContainer = styled.div``;
