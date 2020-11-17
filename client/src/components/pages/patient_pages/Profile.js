import React, { useContext, useEffect, useState } from "react";
import { Container, Form, InputGroup, Alert } from "react-bootstrap";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@material-ui/core";
import { Edit, Save, Clear, Update, Warning } from "@material-ui/icons";
import { Alert as MuiAlert } from "@material-ui/lab";
import { useHistory } from "react-router-dom";
import UserContext from "../../../context/UserContext";

const PatientProfile = () => {
  let currentDate = new Date();
  const { userData, setUserData, setDidDeactivate, setUserName } = useContext(
    UserContext
  );
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    details: {
      sex: "",
      birthdate: {
        month: "",
        day: "",
        year: "",
      },
      address: {
        street: "",
        city: "",
        province: "",
      },

      philhealthNo: "",
      pwdNo: "",
      seniorNo: "",
    },
    medHist: {
      drugallergies: "",
      medications: "",
      otherillness: "",
    },
  };
  const [patient, setPatient] = useState(initialState);
  const [updatePw, setUpdatePw] = useState({
    oldPass: "",
    newPass: "",
    confirmNew: "",
  });
  const [pwAlert, setPwAlert] = useState({
    content: "",
    show: false,
    variant: "danger",
  });
  const [isSendingData, setIsSending] = useState(false);
  const [accntFormStat, setAccntFormStat] = useState(true);
  const [deactPw, setDeactPw] = useState("");
  const [deactModal, setDeactModal] = useState(false);
  const [deactAlert, setDeactAlert] = useState({
    show: false,
    content: "",
    variant: "danger",
  });
  const history = useHistory();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setDeactAlert({ ...deactAlert, show: false });
  };
  const months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const deactModalToggle = () => {
    setDeactModal(!deactModal);
  };

  const onDeactClick = () => {
    deactModalToggle();
  };

  const onChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const onDetailsChange = (e) => {
    setPatient((prevState) => ({
      ...prevState,
      details: {
        ...prevState.details,
        [e.target.name]: e.target.value,
      },
    }));
  };

  const onAddressChange = (e) => {
    setPatient((prevState) => ({
      ...prevState,
      details: {
        ...prevState.details,
        address: {
          ...prevState.details.address,
          [e.target.name]: e.target.value,
        },
      },
    }));
  };

  const onDropdownChange = (e) => {
    setPatient((prevState) => ({
      ...prevState,
      details: {
        ...prevState.details,
        birthdate: {
          ...prevState.details.birthdate,
          [e.target.name]: e.target.value,
        },
      },
    }));
  };

  const onMedHistChange = (e) => {
    setPatient((prevState) => ({
      ...prevState,
      medHist: {
        ...prevState.medHist,
        [e.target.name]: e.target.value,
      },
    }));
  };

  const onUpdatePwChange = (e) => {
    setUpdatePw({ ...updatePw, [e.target.name]: e.target.value });
  };

  const onDeactPwChange = (e) => {
    setDeactPw(e.target.value);
  };

  const initDays = () => {
    let days = 31;
    let options = [];

    if (patient.details.birthdate.month === "February") days = 28;
    else if (
      patient.details.birthdate.month === "April" ||
      patient.details.birthdate.month === "June" ||
      patient.details.birthdate.month === "September" ||
      patient.details.birthdate.month === "November"
    )
      days = 30;
    else days = 31;

    options.push("");

    for (let i = 1; i <= days; i++) {
      let n = String(i);
      if (i < 10) n = "0" + n;
      options.push(n);
    }

    return options.map((e) => {
      return (
        <option key={e} value={e}>
          {e}
        </option>
      );
    });
  };

  const initYears = () => {
    let currentYear = currentDate.getFullYear();
    let options = [];

    options.push("");

    for (let i = 0; i <= 100; i++) {
      let n = String(currentYear - i);
      options.push(n);
    }

    return options.map((e) => {
      return (
        <option key={e} value={e}>
          {e}
        </option>
      );
    });
  };

  const accntToggle = () => {
    setAccntFormStat(!accntFormStat);
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
          {isSendingData ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
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
          )}
        </>
      );
  };

  const getPatient = () => {
    setPatient(initialState);
    try {
      let token = localStorage.getItem("auth-token");
      fetch(`/api/patient/${userData.user.id}`, {
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
            setPatient(data.user);
            setUserName(`${data.user.firstName} ${data.user.lastName}`);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const onSave = () => {
    setIsSending(true);
    let token = localStorage.getItem("auth-token");
    try {
      fetch(`/api/patient/update/${userData.user.id}`, {
        method: "PUT",
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patient),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.msgError) {
            console.log(data.msg.body);
          } else {
            getPatient();
          }
          setIsSending(false);
        });
    } catch (error) {
      console.log(error);
    }
    accntToggle();
  };

  const onCancel = () => {
    getPatient();
    accntToggle();
  };

  const onUpdatePW = () => {
    if (
      updatePw.oldPass === "" ||
      updatePw.newPass === "" ||
      updatePw.confirmNew === ""
    ) {
      setPwAlert({
        content: "All fields required!",
        show: true,
        variant: "danger",
      });
    } else if (updatePw.newPass.length < 8) {
      setPwAlert({
        content: "Passwords must be at least 8 characters long.",
        show: true,
        variant: "danger",
      });
    } else if (updatePw.newPass !== updatePw.confirmNew) {
      setPwAlert({
        content: "New passwords don't match.",
        show: true,
        variant: "danger",
      });
    } else {
      setIsSending(true);

      try {
        let token = localStorage.getItem("auth-token");
        fetch(`/api/patient/changePass/${userData.user.id}`, {
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
              setPwAlert({
                content: data.msg.body,
                show: true,
                variant: "danger",
              });
              setIsSending(false);
            } else {
              setPwAlert({
                content: data.msg.body,
                show: true,
                variant: "success",
              });
              setIsSending(false);
              setUpdatePw({
                oldPass: "",
                newPass: "",
                confirmNew: "",
              });
            }
          });
      } catch (error) {
        setPwAlert({ content: error, variant: "danger", show: true });
      }
    }
  };

  const deactivateAccount = () => {
    const data = { password: deactPw };
    let token = localStorage.getItem("auth-token");
    try {
      fetch(`/api/patient/deactivate/${userData.user.id}`, {
        method: "DELETE",
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
            deactModalToggle();
            setDeactAlert({
              show: true,
              content: data.msg.body,
              variant: "danger",
            });
          } else {
            setDidDeactivate(true);
            deactModalToggle();
            setUserData({
              token: null,
              user: null,
            });
            localStorage.setItem("auth-token", "");
            history.push("/");
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPatient();
  }, []);

  return (
    <div className="row">
      <div className="col-2 border-right border-info" id="sticky-sidebar">
        <div className="sticky-top ">
          <ul className="nav flex-column mt-2">
            <li className="nav-item">
              <a className="nav-link small" href="#accountinfo">
                Account Information
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link small" href="#patientdetails">
                Patient Details
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link small" href="#medicalhistory">
                Medical History
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link small" href="#changepassword">
                Change Password
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link small" href="#deactivateaccount">
                Deactivate Account
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="col-9">
        <Container className="mt-2 p-3 ">
          <Form>
            {/* ==================ACCOUNT INFORMATION=================== */}
            <>
              <div className="col m-2">
                <div className="row align-bottom">
                  <h4 id="accountinfo" className="mr-4">
                    Account Information
                  </h4>
                  {renderAccntActions()}
                </div>
                <div className="row border-top mb-3 mt-2"></div>
              </div>

              {/* ==================NAME FIELD=================== */}

              <Form.Row className="align-items-center m-2">
                <div className="col-1  ">
                  <Form.Label>
                    <b>Name</b>
                  </Form.Label>
                </div>

                <div className="col-3">
                  <Form.Group>
                    <Form.Control
                      onChange={onChange}
                      value={patient.firstName}
                      disabled={accntFormStat}
                      type="text"
                      name="firstName"
                    />
                    <Form.Text className="text-muted">First Name</Form.Text>
                  </Form.Group>
                </div>

                <div className="col-3">
                  <Form.Group>
                    <Form.Control
                      onChange={onChange}
                      value={patient.lastName}
                      disabled={accntFormStat}
                      type="text"
                      name="lastName"
                    />
                    <Form.Text className="text-muted">Last Name</Form.Text>
                  </Form.Group>
                </div>
              </Form.Row>

              {/* ==================EMAIL FIELD=================== */}

              <Form.Row className="align-items-center m-2">
                <div className="col-1  ">
                  <Form.Label>
                    <b>Email</b>
                  </Form.Label>
                </div>

                <div className="col-4">
                  <Form.Group>
                    <Form.Control
                      onChange={onChange}
                      value={patient.email}
                      disabled={accntFormStat}
                      type="email"
                      name="email"
                    />
                  </Form.Group>
                </div>
              </Form.Row>

              {/* ==================CONTACT NUMBER FIELD=================== */}

              <Form.Row className="align-items-center m-2">
                <div className="col-1  ">
                  <Form.Label>
                    <b>{`Contact\nNo.`}</b>
                  </Form.Label>
                </div>

                <div className="col-4">
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>+63</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      onChange={onChange}
                      value={patient.contactNo}
                      disabled={accntFormStat}
                      name="contactNo"
                      type="text"
                    />
                  </InputGroup>
                  <Form.Text className="text-muted">
                    i.e. +639101234567
                  </Form.Text>
                </div>
              </Form.Row>
            </>
            {/* ==================PATIENT DETAILS=================== */}
            <>
              <div className="col m-2">
                <div className="row">
                  <h4 id="patientdetails" className="mt-3">
                    Patient Details
                  </h4>
                </div>
                <div className="row border-top mb-3"></div>
              </div>

              {/* ==================BIRTHDATE=================== */}
              <Form.Row className="align-items-center m-2">
                <div className="col-2  ">
                  <Form.Label>
                    <b>Date of Birth</b>
                  </Form.Label>
                </div>

                <div className="col-2 ">
                  <Form.Control
                    disabled={accntFormStat}
                    as="select"
                    value={patient.details.birthdate.month}
                    onChange={onDropdownChange}
                    name="month"
                  >
                    {months.map((e) => {
                      return (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      );
                    })}
                  </Form.Control>
                  <Form.Text className="text-muted">Month</Form.Text>
                </div>
                <div className="col-1">
                  <Form.Control
                    disabled={accntFormStat}
                    as="select"
                    name="day"
                    value={patient.details.birthdate.day}
                    onChange={onDropdownChange}
                  >
                    {initDays()}
                  </Form.Control>
                  <Form.Text className="text-muted">Day</Form.Text>
                </div>
                <div className="col-2">
                  <Form.Control
                    disabled={accntFormStat}
                    as="select"
                    name="year"
                    value={patient.details.birthdate.year}
                    onChange={onDropdownChange}
                  >
                    {initYears()}
                  </Form.Control>
                  <Form.Text className="text-muted">Year</Form.Text>
                </div>
              </Form.Row>

              {/* ==================SEX=================== */}

              <Form.Row className="align-items-center m-2">
                <div className="col-2  ">
                  <Form.Label>
                    <b>Sex</b>
                  </Form.Label>
                </div>

                <div className="col-1.5">
                  <Form.Group>
                    <Form.Control
                      onChange={onDetailsChange}
                      value={patient.details.sex}
                      disabled={accntFormStat}
                      as="select"
                      name="sex"
                    >
                      <option value=""></option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </Form.Control>
                  </Form.Group>
                </div>
              </Form.Row>

              {/* ==================ADDRESS=================== */}
              <Form.Row className="align-items-center m-2">
                <div className="col-2  ">
                  <Form.Label>
                    <b>Address</b>
                  </Form.Label>
                </div>

                <div className="col-6">
                  <div className="row mb-2">
                    <div className="col">
                      <Form.Control
                        onChange={onAddressChange}
                        value={patient.details.address.street}
                        disabled={accntFormStat}
                        type="text"
                        name="street"
                      />
                      <Form.Text className="text-muted">Street</Form.Text>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <Form.Control
                        onChange={onAddressChange}
                        value={patient.details.address.city}
                        disabled={accntFormStat}
                        type="text"
                        name="city"
                      />
                      <Form.Text className="text-muted">City</Form.Text>
                    </div>
                    <div className="col">
                      <Form.Control
                        onChange={onAddressChange}
                        value={patient.details.address.province}
                        disabled={accntFormStat}
                        type="text"
                        name="province"
                      />
                      <Form.Text className="text-muted">Province</Form.Text>
                    </div>
                  </div>
                </div>
              </Form.Row>

              {/* ==================PHILHEALTH NO.=================== */}

              <Form.Row className="align-items-center m-2 pt-2">
                <div className="col-2  ">
                  <Form.Label>
                    <b>PhilHealth No.</b>
                  </Form.Label>
                </div>

                <div className="col-4">
                  <Form.Group>
                    <Form.Control
                      onChange={onDetailsChange}
                      value={patient.details.philhealthNo}
                      disabled={accntFormStat}
                      type="text"
                      name="philhealthNo"
                    />
                    <Form.Text className="text-muted">
                      PhilHealth ID No. (Leave blank if none.)
                    </Form.Text>
                  </Form.Group>
                </div>
              </Form.Row>

              {/* ==================PWD NO.=================== */}

              <Form.Row className="align-items-center m-2 pt-2">
                <div className="col-2  ">
                  <Form.Label>
                    <b>{`PWD ID No.`}</b>
                  </Form.Label>
                </div>

                <div className="col-4">
                  <Form.Group>
                    <Form.Control
                      onChange={onDetailsChange}
                      value={patient.details.pwdNo}
                      disabled={accntFormStat}
                      type="text"
                      name="pwdNo"
                    />
                    <Form.Text className="text-muted">
                      Person with Disability ID No. (Leave blank if none.)
                    </Form.Text>
                  </Form.Group>
                </div>
              </Form.Row>

              {/* ==================SENIOR CITIZEN NO.=================== */}

              <Form.Row className="align-items-center m-2 pt-2">
                <div className="col-2  ">
                  <Form.Label>
                    <b>{`Senior Citizen No.`}</b>
                  </Form.Label>
                </div>

                <div className="col-4">
                  <Form.Group>
                    <Form.Control
                      onChange={onDetailsChange}
                      value={patient.details.seniorNo}
                      disabled={accntFormStat}
                      type="text"
                      name="seniorNo"
                    />
                    <Form.Text className="text-muted">
                      Senior Citizen ID No. (Leave blank if none.)
                    </Form.Text>
                  </Form.Group>
                </div>
              </Form.Row>
            </>
            {/* ==================MEDICAL HISTORY=================== */}
            <>
              <div className="col m-2">
                <div className="row">
                  <h4 id="medicalhistory" className="mt-3">
                    Medical History
                  </h4>
                </div>
                <div className="row border-top mb-3"></div>
              </div>

              {/* ==================DRUG ALLERGIES=================== */}

              <div className="col-6">
                <Form.Row className="align-items-center m-2 mb-5">
                  <Form.Label>
                    <b>Drug allergies. (Separate by commas)</b>
                  </Form.Label>
                  <textarea
                    onChange={onMedHistChange}
                    value={patient.medHist.drugallergies}
                    disabled={accntFormStat}
                    name="drugallergies"
                    className="form-control"
                    rows="4"
                    style={{ resize: "none" }}
                  />
                </Form.Row>

                {/* ==================CURRENT MEDICATIONS=================== */}

                <Form.Row className="align-items-center m-2 mb-5">
                  <Form.Label>
                    <b>Current medications. (Separate by commas)</b>
                  </Form.Label>
                  <textarea
                    onChange={onMedHistChange}
                    value={patient.medHist.medications}
                    disabled={accntFormStat}
                    name="medications"
                    className="form-control"
                    rows="4"
                    style={{ resize: "none" }}
                  />
                </Form.Row>

                {/* ==================OTHER ILLNESSES HISTORY=================== */}

                <Form.Row className="align-items-center m-2 mb-5">
                  <Form.Label>
                    <b>Other Illnesses. (Separate by commas)</b>
                  </Form.Label>
                  <textarea
                    onChange={onMedHistChange}
                    value={patient.medHist.otherillness}
                    disabled={accntFormStat}
                    name="otherillness"
                    className="form-control"
                    rows="4"
                    style={{ resize: "none" }}
                  />
                </Form.Row>
              </div>
            </>
            {/* ==================CHANGE PASSWORD=================== */}
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

              <Form.Row>
                <div className="col-5">
                  <Alert show={pwAlert.show} variant={pwAlert.variant}>
                    {pwAlert.content}
                  </Alert>
                </div>
              </Form.Row>

              <Form.Row className="align-items-center m-2">
                <div className="col-5 text-right">
                  {isSendingData ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    <Button
                      onClick={onUpdatePW}
                      variant="outlined"
                      size="small"
                      startIcon={<Update />}
                    >
                      Update Password
                    </Button>
                  )}
                </div>
              </Form.Row>
            </>
            {/* ==================DEACTIVATE ACCOUNT=================== */}
            <>
              <h4 id="deactivateaccount" className="mt-3">
                Deactivate Account
              </h4>
              <div className="dropdown-divider mb-3" />
              <Form.Row className="align-items-center m-2 mb-5">
                <div className="col-2  ">
                  <Form.Label>
                    <b>Enter password</b>
                  </Form.Label>
                </div>
                <div className="col-3">
                  <Form.Control
                    type="password"
                    name="deactPw"
                    value={deactPw}
                    onChange={onDeactPwChange}
                  />
                </div>
                <div className="col-2">
                  {deactPw.length === 0 ? (
                    ``
                  ) : (
                    <Button
                      onClick={onDeactClick}
                      variant="outlined"
                      size="small"
                      startIcon={<Warning />}
                    >
                      Deactivate
                    </Button>
                  )}
                </div>
              </Form.Row>
            </>
          </Form>
          <Snackbar
            open={deactAlert.show}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <MuiAlert
              severity="error"
              onClose={handleClose}
              elevation={6}
              variant="filled"
            >
              {deactAlert.content}
            </MuiAlert>
          </Snackbar>
          <Dialog open={deactModal} onClose={deactModalToggle}>
            <DialogTitle id="alert-dialog-title">
              Confirm account deactivation.
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Deactivating your account will erase all appointments made
                you've made. Are you sure you want to continue?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={deactModalToggle} color="primary">
                Cancel
              </Button>
              <Button onClick={deactivateAccount} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </div>
    </div>
  );
};

export default PatientProfile;
