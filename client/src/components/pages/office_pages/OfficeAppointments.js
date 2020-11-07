import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Table, Button, Spinner } from "react-bootstrap";
import UserContext from "../../../context/UserContext";

const OfficeAppointments = () => {
  let currentDate = new Date();
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
  const [date, setDate] = useState({
    month: months[currentDate.getMonth()],
    day: String(currentDate.getDate()).padStart(2, "0"),
    year: String(currentDate.getFullYear()),
  });
  const [allSchedList, setAllSchedList] = useState([]);
  const [officeSchedList, setOfficeSchedList] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const getPatientsList = () => {
    let token = localStorage.getItem("auth-token");
    try {
      fetch("/office/getPatients", {
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
              return setPatientsList((oldList) => [
                ...oldList,
                {
                  patient_id: e._id,
                  patient_add:
                    e.address.street +
                    ", " +
                    e.address.city +
                    ", " +
                    e.address.province,
                  patient_name: e.lastName + ", " + e.firstName,
                  patient_email: e.email,
                  patient_birthdate: e.birthdate,
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
    setOfficeSchedList([]);
    setAllSchedList([]);
    let token = localStorage.getItem("auth-token");
    try {
      fetch("/office/getSchedules", {
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
              if (userData.user.id === e.office_id) {
                setOfficeSchedList((oldList) => [
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
          setIsLoaded(true);
        });
    } catch (err) {
      console.log(err.response);
    }
  };

  const makeRecordClick = (e) => {
    console.log(e.target.getAttribute("sched-id"));
  };

  const initTable = () => {
    let newCurrentDate = new Date(
      months[currentDate.getMonth()] +
        " " +
        String(currentDate.getDate()).padStart(2, "0") +
        " " +
        String(currentDate.getFullYear())
    );

    officeSchedList.sort((a, b) => {
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

    return officeSchedList.map((e) => {
      let patient = {};
      const dateObj = new Date(
        e.date.month + " " + e.date.day + " " + e.date.year
      );

      patientsList.forEach((element) => {
        if (e.patient_id === element.patient_id) patient = element;
      });
      if (dateObj >= newCurrentDate)
        return (
          <tr key={e._id}>
            <td className="align-middle">
              {e.date.month + " " + e.date.day + ", " + e.date.year}
            </td>
            <td className="align-middle">{e.timeslot}</td>
            <td className="align-middle">
              {patient ? patient.patient_name : "Error"}
            </td>
            <td className="align-middle">
              <Button sched-id={e._id} size="sm" onClick={makeRecordClick}>
                View Records
              </Button>
            </td>
          </tr>
        );

      return null;
    });
  };

  useEffect(() => {
    getPatientsList();
    getAllSched();
  }, []);
  return (
    <Container className="p-5">
      <Row className="justify-content-between">
        <h3>List of Appointments:</h3>
      </Row>
      {isLoaded ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{initTable()}</tbody>
        </Table>
      ) : (
        <Container>
          <Row className="justify-content-md-center p-5">
            <Spinner animation="border" />
            Loading...
          </Row>
        </Container>
      )}
    </Container>
  );
};

export default OfficeAppointments;
