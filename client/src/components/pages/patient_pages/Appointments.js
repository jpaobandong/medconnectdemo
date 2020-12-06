import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Modal,
} from "react-bootstrap";
import UserContext from "../../../context/UserContext";
import DataTable from "react-data-table-component";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useDate } from "../../hooks/useDate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CardTitle, StyledTextArea, StyledLabel } from "../../../StyledComps";

const monthStrings = [
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

const dayStrings = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const removeUnavailable = (unavailArray, originalArray) => {
  let newArr = originalArray;

  if (unavailArray.length !== 0) {
    unavailArray.forEach((element) => {
      newArr = newArr.filter((time) => time !== element.timeslot);
    });
  }

  return newArr;
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const CancelBtn = styled(Button)`
font-size: 10px;
border-top-left-radius: 5px;
border-bottom-left-radius: 5px;
border-top-right-radius: 5px;
border-bottom-right-radius: 5px;
      columns={columns}
text-align: center;
display: flex;
align-items: center;
justify-content: center;
`;

const LinearIndeterminate = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LinearProgress />
    </div>
  );
};

const isToday = (schedDate, date) => {
  const sDate = new Date(schedDate);
  sDate.setHours(0, 0, 0, 0);
  const dateNow = new Date(date);
  dateNow.setHours(0, 0, 0, 0);
  if (sDate.getTime() === dateNow.getTime()) return true;
  else return false;
};

const dateSort = (a, b) => {
  let aDate = new Date(
    a.date.month + " " + a.date.day + " " + a.date.year + " " + a.timeslot
  );
  let bDate = new Date(
    b.date.month + " " + b.date.day + " " + b.date.year + " " + b.timeslot
  );
  if (aDate < bDate) return -1;
  if (aDate > bDate) return 1;
  return 0;
};

const columns = [
  {
    name: "Name",
    selector: "name",
    sortable: true,
  },
  {
    name: "Specialization",
    selector: "specialization",
    sortable: true,
  },
  {
    name: "Clinic Days",
    selector: "days",
  },
  {
    name: "Clinic Hours",
    selector: "time",
  },
  {
    name: "Email",
    selector: "email",
  },
  {
    name: "Contact",
    selector: "contactNo",
  },
];

const sortFn = (a, b) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};

const loadTimeslots = (selectedDoctor, doctorMap, unavailable) => {
  let options = [
    "06:00 AM",
    "06:30 AM",
    "07:00 AM",
    "07:30 AM",
    "08:00 AM",
    "08:30 AM",
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
  let componentList = [];

  const start = doctorMap.get(selectedDoctor.toString()).clinicHours.start;
  const end = doctorMap.get(selectedDoctor.toString()).clinicHours.end;

  let available = removeUnavailable(
    unavailable,
    options.slice(options.indexOf(start), options.indexOf(end))
  );

  componentList.push(
    <option key="" value="">
      Available Times
    </option>
  );

  available.map((e) => {
    return componentList.push(
      <option key={e} value={e}>
        {e}
      </option>
    );
  });

  return componentList;
};

const isUpcoming = (schedDate, date, time) => {
  const sDate = new Date(schedDate);
  const dateNow = new Date(date + " " + time);
  if (sDate >= dateNow) return true;
  else return false;
};

const hasAppointmentForDay = (p_id, unavailArray) => {
  let confirm = false;
  if (unavailArray.length !== 0) {
    unavailArray.forEach((element) => {
      if (element.patient_id === p_id) {
        confirm = true;
      }
    });
  }
  return confirm;
};

const Appointments = () => {
  const { date, time, month, dateNum, year } = useDate();
  const { userData } = useContext(UserContext);
  const [doctorMap, setDoctorMap] = useState(new Map());
  const [doctorsList, setDoctorsList] = useState([]);
  const [upcomingList, setUpcomingList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date(`${month} ${dateNum + 1}, ${year}`)
  );
  const [selectedDoctor, setDoctor] = useState("");
  const [selectedTimeslot, setTimeslot] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGetting, setIsGetting] = useState(false);
  const [unavailable, setUnavailable] = useState([]);
  const [alertContent, setAlertContent] = useState({
    show: false,
  });
  const [cancelModal, setCancelModal] = useState({
    show: false,
    sched_id: "",
    doctor: "",
    dateTime: "",
  });
  const [reason, setReason] = useState("");

  const onReasonChange = (e) => {
    setReason(e.target.value);
  };

  const schedColumns = [
    {
      name: "Date & Time",
      selector: "schedDateTime",
      sortFunction: dateSort,
      sortable: true,
    },
    {
      name: "Doctor",
      selector: "doctorName",
      sortable: true,
    },
    {
      name: "Cancel",
      button: true,
      cell: (row) => (
        <CancelBtn
          disabled={isToday(row.schedDateTime, date) ? true : false}
          className="btn-danger"
          onClick={() => {
            setCancelModal({
              show: true,
              sched_id: row._id,
              doctor: row.doctorName,
              dateTime: row.schedDateTime,
            });
          }}
        >
          X
        </CancelBtn>
      ),
    },
  ];

  const updateMap = (k, v) => {
    setDoctorMap(new Map(doctorMap.set(k, v)));
  };

  const getDoctorsList = () => {
    let token = localStorage.getItem("auth-token");
    try {
      fetch("/api/patient/getDoctors", {
        method: "GET",
        headers: {
          "x-auth-token": token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.msgError) {
            console.log(data.msg);
          } else {
            data.list.map((e) => {
              const docObj = {
                _id: e._id,
                name: `${e.lastName}, ${e.firstName}`,
                specialization: e.specialization,
                email: e.email,
                contactNo: e.contactNo,
                days: e.clinicDays,
                time: `${e.clinicHours.start}-${e.clinicHours.end}`,
                office: `${e.address.roomNumber} ${e.address.building}`,
              };
              updateMap(e._id, e);
              return setDoctorsList((oldList) => [...oldList, docObj]);
            });
            setIsLoading(false);
          }
        });
    } catch (err) {
      console.log(err.response);
    }
  };

  const getSched = () => {
    setUpcomingList([]);
    let token = localStorage.getItem("auth-token");
    try {
      fetch(`/api/patient/getSchedules/${userData.user.id}`, {
        method: "GET",
        headers: {
          "x-auth-token": token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.msgError) {
            console.log(data.msg);
          } else {
            data.list.map((e) => {
              const schedObj = {
                _id: e._id,
                doctorInfo: e.office_id,
                date: e.date,
                timeslot: e.timeslot,
                schedDateTime: `${e.date.month} ${e.date.day}, ${e.date.year} ${e.timeslot}`,
                doctorName: `${e.office_id.lastName}, ${e.office_id.firstName}`,
              };
              if (isUpcoming(schedObj.schedDateTime, date, time))
                return setUpcomingList((oldList) => [...oldList, schedObj]);
            });
          }
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getSchedForDoctorOnDate = () => {
    if (!selectedDoctor) {
      return;
    }

    if (!selectedDate) {
      return;
    }
    setUnavailable([]);
    setIsGetting(true);
    let token = localStorage.getItem("auth-token");
    try {
      fetch(
        `/api/patient/getSchedFor/${selectedDoctor}/on/${
          monthStrings[selectedDate.getMonth()]
        }-${selectedDate.getDate()}-${selectedDate.getFullYear()}`,
        {
          method: "GET",
          headers: {
            "x-auth-token": token,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          data.result.map((e) => {
            return setUnavailable((oldList) => [...oldList, e]);
          });
          setIsGetting(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const loadDoctorDropdown = () => {
    const componentList = [];

    doctorsList.sort(sortFn);

    componentList.push(
      <option key="" value="">
        Select Doctor
      </option>
    );

    doctorsList.map((e) => {
      return componentList.push(
        <option key={e._id} value={e._id}>
          {e.name}
        </option>
      );
    });
    return componentList;
  };

  const set = () => {
    let token = localStorage.getItem("auth-token");
    setAlertContent({ show: false, content: "" });

    if (!selectedDoctor) {
      setAlertContent({
        show: true,
        variant: "danger",
        content: "Please select a doctor.",
      });
      return;
    }

    if (!selectedDate) {
      setAlertContent({
        show: true,
        variant: "danger",
        content: "Please select a date.",
      });
      return;
    }

    const selectedDayOfTheWeek = dayStrings[selectedDate.getDay()];

    if (
      !doctorMap
        .get(selectedDoctor.toString())
        .clinicDays.includes(selectedDayOfTheWeek)
    ) {
      setAlertContent({
        show: true,
        variant: "danger",
        content:
          "Clinic closed during that date. Please select a different date.",
      });
      return;
    }

    if (!selectedTimeslot) {
      setAlertContent({
        show: true,
        variant: "danger",
        content: "Please select a timeslot",
      });
      return;
    }

    if (hasAppointmentForDay(userData.user.id, unavailable)) {
      setAlertContent({
        show: true,
        variant: "danger",
        content:
          "You already have an appointment for this doctor on this date. Please select another date.",
      });
      return;
    }
    try {
      const data = {
        office_id: selectedDoctor,
        req_date: {
          month: monthStrings[selectedDate.getMonth()],
          day: selectedDate.getDate(),
          year: selectedDate.getFullYear(),
        },
        req_timeslot: selectedTimeslot,
      };
      fetch(`/api/patient/setAppointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.msgError) {
            setAlertContent({
              content: data.msg.body,
              show: true,
              variant: "danger",
            });
          } else {
            setAlertContent({
              content: `${data.msg.body}`,
              show: true,
              variant: "success",
            });
            getSched();
          }
          getSchedForDoctorOnDate();
        });
    } catch (error) {
      setAlertContent({
        show: true,
        variant: "danger",
        content: error,
      });
    }
  };

  const cancel = () => {
    const data = { reason: reason };
    let token = localStorage.getItem("auth-token");
    try {
      fetch(`/api/patient/cancel/${cancelModal.sched_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.msgError) {
            setAlertContent({
              content: data.msg.body,
              show: true,
              variant: "danger",
            });
          } else {
            setAlertContent({
              content: `${data.msg.body}`,
              show: true,
              variant: "success",
            });
            setReason("");
            getSched();
          }
          getSchedForDoctorOnDate();
        });
    } catch (error) {
      setAlertContent({
        show: true,
        variant: "danger",
        content: error,
      });
    }
  };

  useEffect(() => {
    getSched();
    getDoctorsList();
  }, []);

  useEffect(() => {
    getSchedForDoctorOnDate();
  }, [selectedDoctor, selectedDate]);

  return (
    <>
      <Container className="pt-3">
        <Row>
          <div className="col">
            <DataTable
              defaultSortField="schedDateTime"
              title={
                !isLoading ? "Upcoming Appointments" : "Loading Appointments"
              }
              dense
              columns={schedColumns}
              data={upcomingList}
              pagination
              progressPending={isLoading}
              progressComponent={<LinearIndeterminate />}
              paginationRowsPerPageOptions={[10]}
            />
          </div>
          <div className="col p-3">
            <h5>Make an Appointment</h5>
            <Form>
              <Form.Label>Doctor</Form.Label>

              <Form.Group as={Row}>
                <Col>
                  <Form.Control
                    as="select"
                    onChange={(e) => {
                      setDoctor(e.target.value);
                    }}
                    label="Select Doctor"
                  >
                    {doctorsList.length === 0 ? (
                      <option key="" id="" value="">
                        No Doctors
                      </option>
                    ) : (
                      loadDoctorDropdown()
                    )}
                  </Form.Control>
                </Col>
              </Form.Group>

              <Row className="mb-3">
                <Col>
                  <Form.Label>
                    Specialization:{" "}
                    <b>
                      {selectedDoctor === ""
                        ? ""
                        : `${
                            doctorMap.get(selectedDoctor.toString())
                              .specialization
                          }`}
                    </b>
                  </Form.Label>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Label>
                    Clinic Days:{" "}
                    <b>
                      {selectedDoctor === ""
                        ? ""
                        : `${
                            doctorMap.get(selectedDoctor.toString()).clinicDays
                          }`}
                    </b>
                  </Form.Label>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Label>
                    Clinic Hours:{" "}
                    <b>
                      {selectedDoctor === ""
                        ? ""
                        : `${
                            doctorMap.get(selectedDoctor.toString()).clinicHours
                              .start
                          }-${
                            doctorMap.get(selectedDoctor.toString()).clinicHours
                              .end
                          }`}
                    </b>
                  </Form.Label>
                </Col>
              </Row>

              <Form.Group as={Row}>
                <Col>
                  <div className="col-sm">
                    <Form.Label>Date</Form.Label>
                  </div>
                  <div className="col-sm">
                    <DatePicker
                      minDate={new Date(`${month} ${dateNum},${year}`)}
                      dateFormat="MMMM d, yyyy"
                      selected={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date);
                      }}
                    />
                  </div>
                </Col>
                <Col>
                  <div className="col-sm">
                    <Form.Label>Time</Form.Label>
                  </div>

                  <div className="col-sm">
                    {isGetting ? (
                      <LinearIndeterminate />
                    ) : (
                      <Form.Control
                        onChange={(e) => {
                          setTimeslot(e.target.value);
                        }}
                        size="sm"
                        as="select"
                      >
                        {selectedDoctor === ""
                          ? ""
                          : loadTimeslots(
                              selectedDoctor,
                              doctorMap,
                              unavailable
                            )}
                      </Form.Control>
                    )}
                  </div>
                </Col>
              </Form.Group>
              <Alert show={alertContent.show} variant={alertContent.variant}>
                {alertContent.content}
              </Alert>
              <Form.Group as={Row} className="pr-3 justify-content-end">
                <Button variant="primary" size="sm" onClick={set}>
                  Set Appointment
                </Button>
              </Form.Group>
            </Form>
          </div>
        </Row>
        <Row>
          <DataTable
            defaultSortField="name"
            title={!isLoading ? "Doctors" : "Loading Doctors"}
            columns={columns}
            data={doctorsList}
            pagination
            paginationPerPage={15}
            paginationRowsPerPageOptions={[15]}
            progressPending={isLoading}
            progressComponent={<LinearIndeterminate />}
            dense
          />
        </Row>
      </Container>

      <Modal centered show={cancelModal.show} className="p-3" backdrop="static">
        <Modal.Header>
          <b>Appointment Cancellation</b>
        </Modal.Header>
        <Modal.Body>
          <StyledLabel>
            Are you sure you want to cancel your appointment with{" "}
            <b>Dr. {cancelModal.doctor}</b> on <b>{cancelModal.dateTime}</b>?
          </StyledLabel>
          <br />
          <StyledLabel>Reason</StyledLabel>
          <StyledTextArea
            type="text"
            placeholder="Indicating a reason for cancellation would help us improve our services."
            onChange={onReasonChange}
            value={reason}
            row={3}
            as="textarea"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setCancelModal({ ...cancelModal, show: false });
            }}
          >
            No
          </Button>
          <Button
            onClick={() => {
              setCancelModal({ ...cancelModal, show: false });
              cancel();
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Appointments;
