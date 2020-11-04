import React, { useEffect, useState, useContext } from "react";
import {
  Button,
  Container,
  Row,
  Table,
  Modal,
  Form,
  Col,
  Alert,
} from "react-bootstrap";
import UserContext from "../../../context/UserContext";

//--------TODO: initialize selectedDoctor on render

const Appointments = () => {
  let currentDate = new Date();
  let nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() + 1);
  const months = [
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
  const { userData } = useContext(UserContext);
  const [allSchedList, setAllSchedList] = useState([]);
  const [patientSchedList, setPatientSchedList] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState({
    month: months[nextDate.getMonth()],
    day: String(nextDate.getDate()).padStart(2, "0"),
    year: String(nextDate.getFullYear()),
  });
  const [timeSlot, setTimeSlot] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);
  const [alertContent, setAlertContent] = useState({
    content: "",
    show: false,
    variant: "danger",
  });

  const getDoctorsList = () => {
    let token = localStorage.getItem("auth-token");
    try {
      fetch("/patient/getDoctors", {
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
              if (data.list[0]._id === e._id) setSelectedDoctor(e._id);

              return setDoctorsList((oldList) => [
                ...oldList,
                {
                  office_add: e.address.roomNumber + ", " + e.address.building,
                  office_id: e._id,
                  doctor_name: e.lastName + ", " + e.firstName,
                },
              ]);
            });
          }
        });
    } catch (err) {
      console.log(err.response);
    }
  };

  const getAllSched = () => {
    setPatientSchedList([]);
    setAllSchedList([]);
    let token = localStorage.getItem("auth-token");
    try {
      fetch("/patient/getSchedules", {
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
              if (userData.user.id === e.patient_id) {
                setPatientSchedList((oldList) => [
                  ...oldList,
                  {
                    _id: e._id,
                    office_id: e.office_id,
                    patient_id: e.patient_id,
                    timeslot: e.timeslot,
                    date: {
                      month: e.date.month,
                      day: e.date.day,
                      year: e.date.year,
                    },
                  },
                ]);
              }
              return setAllSchedList((oldList) => [
                ...oldList,
                {
                  office_id: e.office_id,
                  patient_id: e.patient_id,
                  timeslot: e.timeslot,
                  date: {
                    month: e.date.month,
                    day: e.date.day,
                    year: e.date.year,
                  },
                },
              ]);
            });
          }
        });
    } catch (err) {
      console.log(err.response);
    }
  };

  const loadDropdown = () => {
    return doctorsList.map((e) => {
      return (
        <option key={e.office_id} value={e.office_id}>
          {e.doctor_name}
        </option>
      );
    });
  };

  const initDays = () => {
    let days = 31;
    let options = [];
    switch (date.month) {
      case "February":
        days = 28;
        break;
      case "April":
        days = 30;
        break;
      case "June":
        days = 30;
        break;
      case "September":
        days = 30;
        break;
      case "November":
        days = 30;
        break;
      default:
        days = 31;
    }
    //------PLEASE OPTIMIZE

    for (let i = 1; i <= days; i++) {
      options.push(i);
    }
    return options.map((e) => {
      let n = String(e);
      if (e < 10) n = "0" + n;
      return (
        <option key={n} value={n}>
          {n}
        </option>
      );
    });
  };

  const initTimeSlots = () => {
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
    let takenSlots = [];

    allSchedList.forEach((element) => {
      if (
        element.date.month === date.month &&
        element.date.day === date.day &&
        element.date.year === date.year
      ) {
        takenSlots.push(element.timeslot);
      }
    });

    return options.map((e) => {
      if (takenSlots.includes(e)) return null;
      else {
        if (timeSlot === "") setTimeSlot(e);
        return (
          <option key={e} value={e}>
            {e}
          </option>
        );
      }
    });
  };

  const initTable = () => {
    let newCurrentDate = new Date(
      months[currentDate.getMonth()] +
        " " +
        String(currentDate.getDate()).padStart(2, "0") +
        " " +
        String(currentDate.getFullYear())
    );

    patientSchedList.sort((a, b) => {
      const aDate = new Date(
        a.date.month + " " + a.date.day + " " + a.date.year
      );
      const bDate = new Date(
        b.date.month + " " + b.date.day + " " + b.date.year
      );
      if (aDate < bDate) return -1;
      if (aDate > bDate) return 1;
      return 0;
    });

    return patientSchedList.map((e) => {
      let doctor = {};
      const dateObj = new Date(
        e.date.month + " " + e.date.day + " " + e.date.year
      );

      doctorsList.forEach((element) => {
        if (e.office_id === element.office_id) doctor = element;
      });
      if (dateObj >= newCurrentDate)
        return (
          <tr key={e._id}>
            <td>{e.date.month + " " + e.date.day + ", " + e.date.year}</td>
            <td>{e.timeslot}</td>
            <td>{doctor ? doctor.doctor_name : "Error"}</td>
            <td>{doctor ? doctor.office_add : "Error"}</td>
          </tr>
        );

      return null;
    });
  };

  const toggleMod = () => {
    setDisableBtn(false);
    setAlertContent({
      content: "",
      show: false,
      variant: "danger",
    });
    setShowModal(!showModal);
  };

  const setAppointment = () => {
    setDisableBtn(true);
    const data = {
      office_id: selectedDoctor,
      req_date: date,
      req_timeslot: timeSlot,
    };
    let token = localStorage.getItem("auth-token");
    const dateObj = new Date(date.month + " " + date.day + " " + date.year);
    if (dateObj <= currentDate) {
      setAlertContent({
        show: true,
        content: "Cannot set appointment for today or earlier.",
        variant: "danger",
      });
      setDisableBtn(false);
      return false;
    } else {
      fetch("/patient/setAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
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
            setDisableBtn(false);
          } else {
            setAlertContent({
              content: "Appointment set!",
              show: true,
              variant: "success",
            });
            setTimeout(() => {
              toggleMod();
              getAllSched();
            }, 2000);
          }
        });
    }
  };

  const onDropdownChange = (e) => {
    setDate({ ...date, [e.target.name]: e.target.value });
  };

  const onTSChange = (e) => {
    setTimeSlot(e.target.value);
  };

  useEffect(() => {
    getDoctorsList();
    getAllSched();
  }, []);

  return (
    <>
      <Container className="p-5">
        <Row className="justify-content-between">
          <h3>List of Appointments:</h3>
          <Button variant="link" onClick={toggleMod}>
            Add Appointment
          </Button>
        </Row>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Doctor</th>
              <th>Office</th>
            </tr>
          </thead>
          <tbody>{initTable()}</tbody>
        </Table>
      </Container>
      <Modal show={showModal} className="p-3" backdrop="static">
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
      </Modal>
    </>
  );
};

export default Appointments;
