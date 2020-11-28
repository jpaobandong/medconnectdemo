import React, { useEffect, useState } from "react";
import { Container, Spinner, Row } from "react-bootstrap";
import { BrowserRouter } from "react-router-dom";
import SwitchNavBar from "./components/navbar/SwitchNavbar";
import Home from "./components/pages/Home";
import Appointments from "./components/pages/patient_pages/Appointments";
import Records from "./components/pages/patient_pages/Records";
import PatientProfile from "./components/pages/patient_pages/Profile";
import Verification from "./components/pages/Verification";
import UserContext from "./context/UserContext";
import PatientRoute from "./components/hocs/PatientRoute";
import GuestRoute from "./components/hocs/GuestRoute";
import AdminRoute from "./components/hocs/AdminRoute";
import PatientAccounts from "./components/pages/admin_pages/PatientAccounts";
import OfficeAccounts from "./components/pages/admin_pages/OfficeAccounts";
import OfficeRoute from "./components/hocs/OfficeRoute";
import OfficeAppointments from "./components/pages/office_pages/OfficeAppointments";
import OfficeRecords from "./components/pages/office_pages/OfficeRecords";
import Dashboard from "./components/pages/patient_pages/Dashboard";
import AdminDash from "./components/pages/admin_pages/AdminDashboard";
import OfficeDashboard from "./components/pages/office_pages/OfficeDashboard";
import OfficeProfile from "./components/pages/office_pages/OfficeProfile";
import PatientRecord from "./components/pages/office_pages/PatientRecord";

function App() {
  const [userData, setUserData] = useState({
    token: null,
    user: null,
  });

  const [didDeactivate, setDidDeactivate] = useState(false);

  const [userName, setUserName] = useState("");

  const [isLoaded, setIsLoaded] = useState(false);

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

  const checkLogin = async () => {
    let token = localStorage.getItem("auth-token");

    if (token === null) {
      localStorage.setItem("auth-token", "");
      token = "";
    } else {
      try {
        await fetch("/api/auth/authenticateUser", {
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

              if (data.user.role === "admin") setUserName("Admin");
              else if (data.user.role === "office")
                getDoctorName(token, data.user.id);
              else getName(token, data.user.id);
            }

            setIsLoaded(true);
          });
      } catch (err) {
        console.log(err.response);
      }
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  if (isLoaded) {
    return (
      <div className="App">
        <BrowserRouter>
          <UserContext.Provider
            value={{
              userData,
              setUserData,
              didDeactivate,
              setDidDeactivate,
              userName,
              setUserName,
            }}
          >
            <SwitchNavBar />

            <GuestRoute exact path="/" component={Home} />
            <GuestRoute path="/verification" component={Verification} />

            <PatientRoute
              path="/patient/appointments"
              component={Appointments}
            />
            <PatientRoute path="/patient/records" component={Records} />
            <PatientRoute path="/patient/profile" component={PatientProfile} />
            <PatientRoute exact path="/patient/" component={Dashboard} />

            <AdminRoute path="/admin/accounts" component={PatientAccounts} />
            <AdminRoute path="/admin/offices" component={OfficeAccounts} />
            <AdminRoute exact path="/admin/" component={AdminDash} />

            <OfficeRoute
              path="/office/appointments"
              component={OfficeAppointments}
            />
            <OfficeRoute path="/office/records" component={OfficeRecords} />
            <OfficeRoute path="/office/profile" component={OfficeProfile} />
            <OfficeRoute
              path="/office/appointment/:id"
              component={PatientRecord}
            />
            <OfficeRoute exact path="/office/" component={OfficeDashboard} />
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
