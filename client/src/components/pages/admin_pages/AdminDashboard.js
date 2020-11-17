import React, { useEffect, useState } from "react";
import { Card, CardColumns, Container } from "react-bootstrap";
import { useDate } from "../../hooks/useDate";

const AdminDash = () => {
  const { wish, day, date, time } = useDate();
  const [upcomingList, setUpcomingList] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);

  const getDoctors = () => {
    setDoctorsList([]);
    let token = localStorage.getItem("auth-token");
    try {
      fetch("/api/admin/getOffices", {
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
              return setDoctorsList((oldList) => [...oldList, e]);
            });
          }
        });
    } catch (err) {
      console.log(err.response);
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  return (
    <Container className="pt-3">
      <div className="p-2 mb-3 border border-info d-flex justify-content-between">
        {`${wish} `}
        <b>{`${day} ${date} ${time}`}</b>
      </div>
      {/* ============CARD COLUMN=============== */}
      <CardColumns>
        <Card>
          <Card.Header>
            <b>All Upcoming Appointments</b>
          </Card.Header>
        </Card>
        <Card>
          <Card.Header>
            <b>Total Doctors</b>
          </Card.Header>
          {doctorsList.length === 0 ? (
            <Card.Body>
              There are currently no doctor's offices registered in the system.
            </Card.Body>
          ) : (
            <Card.Body>{`${doctorsList.length}`}</Card.Body>
          )}
        </Card>
      </CardColumns>
    </Container>
  );
};

export default AdminDash;
