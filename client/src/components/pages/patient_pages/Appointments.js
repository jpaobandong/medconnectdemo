import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import UserContext from "../../../context/UserContext";
import DataTable from "react-data-table-component";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useDate } from "../../hooks/useDate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

const LinearIndeterminate = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LinearProgress />
    </div>
  );
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
  const today = new Date();
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
    content: "",
  });

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
              content: data.msg.body,
              show: true,
              variant: "success",
            });
            getSched();
          }
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
      <Container className="p-5">
        <Row>
          <div className="col">
            <DataTable
              defaultSortField="schedDateTime"
              title={
                !isLoading ? "Upcoming Appointments" : "Loading Appointments"
              }
              columns={schedColumns}
              data={upcomingList}
              pagination
              progressPending={isLoading}
              progressComponent={<LinearIndeterminate />}
              paginationRowsPerPageOptions={[10]}
            />
          </div>
          <div className="col border border-primary rounded p-3">
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
                      minDate={new Date(`${month} ${dateNum + 1},${year}`)}
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
            progressPending={isLoading}
            progressComponent={<LinearIndeterminate />}
            dense
          />
        </Row>
      </Container>
      {/* <Modal show={showModal} className="p-3" backdrop="static">
        <Modal.Body>
          <Form>
            <Form.Label>Doctor</Form.Label>

            <Form.Group as={Row}>
              <Col>
                <Form.Control
                  as="select"
                  value={selectedDoctor}
                  onChange={(e) => {
                    setSelectedDoctor(e.target.value);
                  }}
                >
                  {loadDropdown()}
                </Form.Control>
              </Col>
            </Form.Group>
            <Form.Label>Time and Date</Form.Label>
            <Form.Group as={Row}>
              <Col>
                <Form.Control
                  as="select"
                  value={timeSlot}
                  onChange={onTSChange}
                  name="timeSlot"
                >
                  {initTimeSlots()}
                </Form.Control>
              </Col>

              <Col>
                <Form.Control
                  as="select"
                  value={date.month}
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
              </Col>

              <Col lg="2.5">
                <Form.Control
                  as="select"
                  value={date.day}
                  onChange={onDropdownChange}
                  name="day"
                >
                  {initDays()}
                </Form.Control>
              </Col>

              <Col lg="3">
                <Form.Control
                  as="select"
                  value={date.year}
                  onChange={onDropdownChange}
                  name="year"
                >
                  <option value="2020">2020</option>
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </Form.Control>
              </Col>
            </Form.Group>
          </Form>
          <Alert show={alertContent.show} variant={alertContent.variant}>
            {alertContent.content}
          </Alert>
        </Modal.Body>

        <Modal.Footer>
          <Button disabled={disableBtn} variant="secondary" onClick={toggleMod}>
            Close
          </Button>
          <Button
            disabled={disableBtn}
            variant="primary"
            onClick={setAppointment}
          >
            Set Appointment
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  );
};

export default Appointments;
