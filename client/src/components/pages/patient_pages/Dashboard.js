import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Container,
  CardColumns,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import UserContext from "../../../context/UserContext";
import { useDate } from "../../hooks/useDate";

const Dashboard = () => {
  const { wish, day, date, time } = useDate();
  const { userData } = useContext(UserContext);
  const [appointCountToday, setACT] = useState(0);
  const [upcomingList, setUpcomingList] = useState([]);
  const [finishedList, setFinishedList] = useState([]);
  const [nextAppointDoc, setNextAppointDoc] = useState({});

  const getSchedules = () => {
    let token = localStorage.getItem("auth-token");
    try {
      fetch(`/api/patient/getSchedules/${userData.user.id}`, {
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
            data.scheds.map((e) => {
              if (
                isUpcoming(
                  e.date.month +
                    " " +
                    e.date.day +
                    " " +
                    e.date.year +
                    " " +
                    e.timeslot
                )
              ) {
                setUpcomingList((oldList) => [
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
                if (
                  isToday(e.date.month + " " + e.date.day + " " + e.date.year)
                )
                  setACT(appointCountToday + 1);
              } else {
                setFinishedList((oldList) => [
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
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getDoctor = (id) => {
    let token = localStorage.getItem("auth-token");
    try {
      fetch(`/api/patient/getDoctors/${id}`, {
        method: "GET",
        headers: {
          "x-auth-token": token,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setNextAppointDoc(data.doctor[0]);
        });
    } catch (error) {
      console.log(error);
    }
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

  const isUpcoming = (schedDate) => {
    const sDate = new Date(schedDate);
    const dateNow = new Date(date + " " + time);
    if (sDate >= dateNow) return true;
    else return false;
  };

  const isToday = (schedDate) => {
    const sDate = new Date(schedDate);
    const dateNow = new Date(date);
    if (sDate.getTime() === dateNow.getTime()) return true;
    else return false;
  };

  const loadPrevAppoint = () => {
    finishedList.sort((a, b) => {
      return dateSort(a, b);
    });

    var arrcopy = finishedList.slice(0, 3);

    return arrcopy.map((e) => {
      return (
        <ListGroupItem key={e._id}>
          {`${e.date.month} ${e.date.day}, ${e.date.year} \n${e.timeslot}`}
        </ListGroupItem>
      );
    });
  };

  const loadUpcomingList = () => {
    upcomingList.sort((a, b) => {
      return dateSort(a, b);
    });
    getDoctor(upcomingList[0].office_id);
    var arrcopy = upcomingList.slice(0, 3);

    return arrcopy.map((e) => {
      return (
        <ListGroupItem key={e._id}>
          <a href="#">{`${e.date.month} ${e.date.day}, ${e.date.year} \n${e.timeslot}`}</a>
        </ListGroupItem>
      );
    });
  };

  useEffect(() => {
    getSchedules();
  }, []);

  return (
    <>
      <Container className="pt-3">
        <div className="p-2 mb-3 border border-info d-flex justify-content-between">
          {`${wish} `}
          {appointCountToday === 0
            ? `You have no appointments today.`
            : `You have ${appointCountToday} more appointment(s) today.`}
          <b>{`${day} ${date} ${time}`}</b>
        </div>
        <CardColumns>
          {/* ---------------------------------- */}
          <Card /* style={{ width: "auto" }} */ id="upcoming-appointments-card">
            <Card.Header>
              <b>Upcoming Appointments</b> (Showing next 5)
            </Card.Header>
            {upcomingList.length === 0 ? (
              <Card.Body>You do not have any upcoming appointments.</Card.Body>
            ) : (
              <ListGroup className="list-group-flush">
                {loadUpcomingList()}
              </ListGroup>
            )}
          </Card>

          {/* ---------------------------------- */}

          <Card /* style={{ width: "auto" }} */ id="next-appointment-card">
            <Card.Header>
              <b>Next Appointment</b>
            </Card.Header>
            {upcomingList.length === 0 ? (
              <Card.Body>
                You do not have any new appointments yet. You can create one{" "}
                <Link to="/patient/appointments">here</Link>.
              </Card.Body>
            ) : (
              <Card.Body>
                <Card.Title>
                  {`${upcomingList[0].date.month} ${upcomingList[0].date.day},
                    ${upcomingList[0].date.year} ${upcomingList[0].timeslot}`}
                </Card.Title>

                {nextAppointDoc === undefined
                  ? `Cannot get Doctor Information. You can contact the hospital administration through \n\n Email: medconnect.head@gmail.com \n Call/Text: +639063173242`
                  : `${nextAppointDoc.lastName}, ${nextAppointDoc.firstName}`}
              </Card.Body>
            )}
          </Card>
          <br />

          {/* ---------------------------------- */}

          <Card /* style={{ width: "18rem" }} */ id="previous-appointment-card">
            <Card.Header>
              <b>Previous Appointment</b>
            </Card.Header>
            {finishedList.length === 0 ? (
              <Card.Body>
                You do not have any previous appointments yet
              </Card.Body>
            ) : (
              <ListGroup className="list-group-flush">
                {loadPrevAppoint()}
              </ListGroup>
            )}
          </Card>
        </CardColumns>
      </Container>
    </>
  );
};

export default Dashboard;
