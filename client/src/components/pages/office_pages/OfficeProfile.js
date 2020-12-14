import React, { useState, useContext, useEffect } from "react";
import { Container, Form, InputGroup, Alert, Col } from "react-bootstrap";
import { Button, Snackbar } from "@material-ui/core";
import { Edit, Save, Clear, Update, Warning } from "@material-ui/icons";
import { Alert as MuiAlert } from "@material-ui/lab";
import UserContext from "../../../context/UserContext";
import { useDate } from "../../hooks/useDate";
import styled from "styled-components";

const CBGroupComponent = ({ accntFormStat, clinicDays, CBhandleChange }) => {
  return (
    <>
      <Form.Check
        className="mr-3 ml-3 mt-2 mb-2"
        inline
        onChange={CBhandleChange}
        label="Monday"
        type="checkbox"
        value="Monday"
        name="mondayCB"
        disabled={accntFormStat}
        checked={clinicDays.includes("Monday")}
      />
      <Form.Check
        className="mr-3 ml-3 mt-2 mb-2"
        inline
        onChange={CBhandleChange}
        label="Tuesday"
        type="checkbox"
        value="Tuesday"
        name="tuesdayCB"
        disabled={accntFormStat}
        checked={clinicDays.includes("Tuesday")}
      />
      <Form.Check
        className="mr-3 ml-3 mt-2 mb-2"
        inline
        onChange={CBhandleChange}
        label="Wednesday"
        type="checkbox"
        value="Wednesday"
        name="wednesdayCB"
        disabled={accntFormStat}
        checked={clinicDays.includes("Wednesday")}
      />
      <Form.Check
        className="mr-3 ml-3 mt-2 mb-2"
        inline
        onChange={CBhandleChange}
        label="Thursday"
        type="checkbox"
        value="Thursday"
        name="thursdayCB"
        disabled={accntFormStat}
        checked={clinicDays.includes("Thursday")}
      />
      <Form.Check
        className="mr-3 ml-3 mt-2 mb-2"
        inline
        onChange={CBhandleChange}
        label="Friday"
        type="checkbox"
        value="Friday"
        name="fridayCB"
        disabled={accntFormStat}
        checked={clinicDays.includes("Friday")}
      />
      <Form.Check
        className="mr-3 ml-3 mt-2 mb-2"
        inline
        onChange={CBhandleChange}
        label="Saturday"
        type="checkbox"
        value="Saturday"
        name="saturdayCB"
        disabled={accntFormStat}
        checked={clinicDays.includes("Saturday")}
      />
      <Form.Check
        className="mr-3 ml-3 mt-2 mb-2"
        inline
        onChange={CBhandleChange}
        label="Sunday"
        type="checkbox"
        value="Sunday"
        name="sundayCB"
        disabled={accntFormStat}
        checked={clinicDays.includes("Sunday")}
      />
    </>
  );
};

const initTimeslots = () => {
  let options = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
  ];

  return options.map((e) => {
    return (
      <option key={e} value={e}>
        {e}
      </option>
    );
  });
};

const OfficeProfile = () => {
  const { date } = useDate();
  const { userData, setUserData, setUserName } = useContext(UserContext);
  const [accntFormStat, setAccntFormStat] = useState(true);
  const [updatePw, setUpdatePw] = useState({
    oldPass: "",
    newPass: "",
    confirmNew: "",
  });
  const [user, setUser] = useState(undefined);
  const [days, setDays] = useState([]);
  const [snack, setSnack] = useState({
    show: false,
    content: "",
    variant: "error",
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnack({ ...snack, show: false });
  };

  const onChange = (e) => {
    if (user !== undefined)
      setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onDropdownChange = (e) => {
    setUser((prevState) => ({
      ...prevState,
      clinicHours: {
        ...prevState.clinicHours,
        [e.target.name]: e.target.value,
      },
    }));
  };

  const accntToggle = () => {
    setAccntFormStat(!accntFormStat);
  };

  const CBhandleChange = (e) => {
    if (e.target.checked) setDays((old) => [...old, e.target.value]);
    else setDays(days.filter((day) => day !== e.target.value));
  };

  const onSave = () => {
    var data = {};
    const hStart = new Date(date + " " + user.clinicHours.start);
    const hEnd = new Date(date + " " + user.clinicHours.end);
    var dataDays = [];

    if (days.includes("Monday")) dataDays.push("Monday");
    if (days.includes("Tuesday")) dataDays.push("Tuesday");
    if (days.includes("Wednesday")) dataDays.push("Wednesday");
    if (days.includes("Thursday")) dataDays.push("Thursday");
    if (days.includes("Friday")) dataDays.push("Friday");
    if (days.includes("Saturday")) dataDays.push("Saturday");
    if (days.includes("Sunday")) dataDays.push("Sunday");

    if (
      user.email === "" ||
      user.firstName === "" ||
      user.lastName === "" ||
      user.street === "" ||
      user.city === "" ||
      user.province === "" ||
      user.roomNumber === "" ||
      user.building === "" ||
      user.contactNo === "" ||
      user.specialization === ""
    ) {
      setSnack({
        show: true,
        content: "All fields are required.",
        variant: "error",
      });
      return;
    }

    if (dataDays.length === 0) {
      setSnack({
        show: true,
        content: "Please select at least one clinic day. ",
        variant: "error",
      });
      return;
    }

    if (hStart >= hEnd) {
      setSnack({
        content: "End time should be later than the start time.",
        show: true,
        variant: "error",
      });
      return;
    }

    let token = localStorage.getItem("auth-token");
    data = user;
    data.clinicDays = dataDays;

    try {
      fetch(`/api/office/update/${userData.user.id}`, {
        method: "PUT",
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.msgError) {
            console.log(data.msg.body);
          } else {
            setSnack({
              content: data.msg.body,
              show: true,
              variant: "success",
            });
            getOffice();
          }
        });
    } catch (error) {
      setSnack({
        content: "Error: " + error,
        show: true,
        variant: "error",
      });
    }
    accntToggle();
  };

  const onCancel = () => {
    getOffice();
    accntToggle();
  };

  //UPDATE PW FUNCTIONS
  const onUpdatePwChange = (e) => {
    setUpdatePw({ ...updatePw, [e.target.name]: e.target.value });
  };

  const onUpdatePW = () => {
    if (
      updatePw.oldPass === "" ||
      updatePw.newPass === "" ||
      updatePw.confirmNew === ""
    ) {
      setSnack({
        content: "Password fields required!",
        show: true,
        variant: "error",
      });
    } else if (updatePw.newPass.length < 8) {
      setSnack({
        content: "Passwords must be at least 8 characters long.",
        show: true,
        variant: "error",
      });
    } else if (updatePw.newPass !== updatePw.confirmNew) {
      setSnack({
        content: "New passwords don't match.",
        show: true,
        variant: "error",
      });
    } else {
      try {
        let token = localStorage.getItem("auth-token");
        fetch(`/api/office/changePass/${userData.user.id}`, {
          method: "PUT",
          headers: {
            "x-auth-token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatePw),
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (data.msgError) {
              setSnack({
                content: data.msg.body,
                show: true,
                variant: "error",
              });
            } else {
              setSnack({
                content: data.msg.body,
                show: true,
                variant: "success",
              });
              setUpdatePw({
                oldPass: "",
                newPass: "",
                confirmNew: "",
              });
            }
          });
      } catch (error) {
        setSnack({
          content: error,
          show: true,
          variant: "error",
        });
      }
    }
  };

  const getOffice = () => {
    setUser(undefined);
    try {
      let token = localStorage.getItem("auth-token");
      fetch(`/api/office/getUser/${userData.user.id}`, {
        method: "GET",
        headers: {
          "x-auth-token": token,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.msgError) {
            console.log(data.msg.body);
          } else {
            setUser(data.user);
            setDays(data.user.clinicDays);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const renderAccntActions = () => {
    if (accntFormStat)
      return (
        <Button
          onClick={accntToggle}
          variant="outlined"
          size="small"
          startIcon={<Edit />}
        >
          Edit
        </Button>
      );
    else
      return (
        <>
          <Button
            onClick={onCancel}
            variant="outlined"
            size="small"
            startIcon={<Clear />}
          >
            Cancel
          </Button>
          <div className="mr-2"></div>
          <Button
            onClick={onSave}
            variant="outlined"
            size="small"
            startIcon={<Save />}
          >
            Save
          </Button>
        </>
      );
  };

  useEffect(() => {
    getOffice();
  }, []);

  return (
    <StyledContainer className="p-3 mt-2">
      <Form>
        <div className="col m-2">
          <div className="row align-bottom">
            <h4 id="accountinfo" className="mr-4">
              Account Information
            </h4>
            {renderAccntActions()}
          </div>
          <div className="row border-top mb-3 mt-2"></div>
        </div>
        <>
          {/* ==========NAME=============== */}
          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  onChange={onChange}
                  value={user === undefined ? "" : user.firstName}
                  name="firstName"
                  disabled={accntFormStat}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  onChange={onChange}
                  value={user === undefined ? "" : user.lastName}
                  name="lastName"
                  disabled={accntFormStat}
                />
              </Form.Group>
            </Col>
          </Form.Row>
          {/* ==========EMAIL============== */}
          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label>Email address</Form.Label>

                <Form.Control
                  type="email"
                  onChange={onChange}
                  value={user === undefined ? "" : user.email}
                  name="email"
                  disabled={accntFormStat}
                />
              </Form.Group>
            </Col>
          </Form.Row>
          {/* ==========SPECIALIZATION===== */}
          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label>Specialization</Form.Label>
                <Form.Control
                  type="text"
                  name="specialization"
                  onChange={onChange}
                  value={user === undefined ? "" : user.specialization}
                  disabled={accntFormStat}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  type="text"
                  name="contactNo"
                  onChange={onChange}
                  value={user === undefined ? "" : user.contactNo}
                  disabled={accntFormStat}
                />
              </Form.Group>
            </Col>
          </Form.Row>
          {/* ==========OFFICE DAYS======== */}
          <Form.Row className="mb-1">
            <Col>
              <Form.Group>
                <Form.Label>Clinic Days</Form.Label>
                <Form.Row className="justify-content-around">
                  <CBGroupComponent
                    accntFormStat={accntFormStat}
                    CBhandleChange={CBhandleChange}
                    clinicDays={days}
                  />
                </Form.Row>
              </Form.Group>
            </Col>
          </Form.Row>
          {/* ==========OFFICE HOURS======= */}
          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label>Clinic Hours</Form.Label>
                <Form.Row className="text-center">
                  <div className="col-1">
                    <Form.Label className="pt-1">Start</Form.Label>
                  </div>

                  <Col>
                    <Form.Control
                      onChange={onDropdownChange}
                      value={
                        user === undefined ? "9:00 AM" : user.clinicHours.start
                      }
                      name="start"
                      as="select"
                      disabled={accntFormStat}
                    >
                      {initTimeslots()}
                    </Form.Control>
                  </Col>
                  <div className="col-1">
                    <Form.Label className="pt-1">End</Form.Label>
                  </div>

                  <Col>
                    <Form.Control
                      onChange={onDropdownChange}
                      value={
                        user === undefined ? "9:00 AM" : user.clinicHours.end
                      }
                      name="end"
                      as="select"
                      disabled={accntFormStat}
                    >
                      {initTimeslots()}
                    </Form.Control>
                  </Col>
                </Form.Row>
              </Form.Group>
            </Col>
          </Form.Row>
          {/* ==========ADDRESS 1========== */}
          <Form.Row>
            <Col md={2} lg={2} sm={2} xs={2}>
              <Form.Group>
                <Form.Label>Rm. #</Form.Label>
                <Form.Control
                  type="text"
                  onChange={onChange}
                  value={user === undefined ? "" : user.address.roomNumber}
                  name="roomNumber"
                  disabled={accntFormStat}
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group>
                <Form.Label>Building</Form.Label>
                <Form.Control
                  type="text"
                  onChange={onChange}
                  value={user === undefined ? "" : user.address.building}
                  name="building"
                  disabled={accntFormStat}
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group>
                <Form.Label>Street Address</Form.Label>
                <Form.Control
                  type="text"
                  onChange={onChange}
                  value={user === undefined ? "" : user.address.street}
                  name="street"
                  disabled={accntFormStat}
                />
              </Form.Group>
            </Col>
          </Form.Row>
          {/* =============ADDRESS 2======= */}
          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  onChange={onChange}
                  value={user === undefined ? "" : user.address.city}
                  name="city"
                  disabled={accntFormStat}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Province</Form.Label>
                <Form.Control
                  type="text"
                  onChange={onChange}
                  value={user === undefined ? "" : user.address.province}
                  name="province"
                  disabled={accntFormStat}
                />
              </Form.Group>
            </Col>
          </Form.Row>
        </>

        <>
          <h4 id="changepassword" className="mt-3">
            Change Password
          </h4>
          <div className="dropdown-divider mb-3" />

          <Form.Row className="align-items-center m-2">
            <div className="col-2  ">
              <Form.Label>
                <b>Old Password</b>
              </Form.Label>
            </div>

            <div className="col-3">
              <Form.Group>
                <Form.Control
                  value={updatePw.oldPass}
                  onChange={onUpdatePwChange}
                  name="oldPass"
                  type="password"
                />
              </Form.Group>
            </div>
          </Form.Row>

          <Form.Row className="align-items-center m-2">
            <div className="col-2  ">
              <Form.Label>
                <b>New Password</b>
              </Form.Label>
            </div>

            <div className="col-3">
              <Form.Group>
                <Form.Control
                  value={updatePw.newPass}
                  onChange={onUpdatePwChange}
                  name="newPass"
                  type="password"
                />
              </Form.Group>
            </div>
          </Form.Row>

          <Form.Row className="align-items-center m-2">
            <div className="col-2  ">
              <Form.Label>
                <b>Confirm Password</b>
              </Form.Label>
            </div>

            <div className="col-3">
              <Form.Group>
                <Form.Control
                  value={updatePw.confirmNew}
                  onChange={onUpdatePwChange}
                  name="confirmNew"
                  type="password"
                />
              </Form.Group>
            </div>
          </Form.Row>

          <Form.Row className="align-items-center m-2">
            <div className="col-5 text-right">
              <Button
                onClick={onUpdatePW}
                variant="outlined"
                size="small"
                startIcon={<Update />}
              >
                Update Password
              </Button>
            </div>
          </Form.Row>
        </>
      </Form>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snack.show}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <MuiAlert
          severity={snack.variant}
          onClose={handleClose}
          elevation={6}
          variant="filled"
        >
          {snack.content}
        </MuiAlert>
      </Snackbar>
    </StyledContainer>
  );
};

export default OfficeProfile;

const StyledContainer = styled(Container)`
  min-height: 100vh;
`;
