import React, { useEffect, useState } from "react";
import { Container, Spinner, Row } from "react-bootstrap";
import { BrowserRouter } from "react-router-dom";
import SwitchNavBar from "./components/navbar/SwitchNavbar";
import Home from "./components/pages/Home";
import Appointments from "./components/pages/patient_pages/Appointments";
import Records from "./components/pages/patient_pages/Records";
import DoctorsList from "./components/pages/patient_pages/DoctorsList";
import Verification from "./components/pages/Verification";
import UserContext from "./context/UserContext";
import PatientRoute from "./components/hocs/PatientRoute";
import GuestRoute from "./components/hocs/GuestRoute";
import AdminRoute from "./components/hocs/AdminRoute";
import PatientAccounts from "./components/pages/admin_pages/PatientAccounts";
import OfficeAccounts from "./components/pages/admin_pages/OfficeAccounts";

function App() {
  const [userData, setUserData] = useState({
    token: null,
    user: null,
  });

  const [isLoaded, setIsLoaded] = useState(false);

  const checkLogin = async () => {
    let token = localStorage.getItem("auth-token");

    if (token === null) {
      localStorage.setItem("auth-token", "");
      token = "";
    }

    try {
      await fetch("/auth/authenticateUser", {
        method: "POST",
        headers: {
          "x-auth-token": token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.msgError) {
            setUserData({
              token,
              user: data.user,
            });
          }

          setIsLoaded(true);
        });
    } catch (err) {
      console.log(err.response);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  if (isLoaded) {
    return (
      <div className="App">
        <BrowserRouter>
          <UserContext.Provider value={{ userData, setUserData }}>
            <SwitchNavBar />
            <GuestRoute exact path="/" component={Home} />
            <GuestRoute path="/verification" component={Verification} />
            <PatientRoute path="/appointments" component={Appointments} />
            <PatientRoute path="/doctorslist" component={DoctorsList} />
            <PatientRoute path="/records" component={Records} />
            <AdminRoute path="/accounts" component={PatientAccounts} />
            <AdminRoute path="/offices" component={OfficeAccounts} />
          </UserContext.Provider>
        </BrowserRouter>
      </div>
    );
  } else {
    return (
      <div className="App">
        <Container>
          <Row className="justify-content-md-center p-5">
            <h2>
              <Spinner animation="border" />
              Loading...
            </h2>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
