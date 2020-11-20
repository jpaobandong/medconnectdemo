import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import UserContext from "../../../context/UserContext";
import { useDate } from "../../hooks/useDate";
import DataTable from "react-data-table-component";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

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
    name: "Date & Time",
    selector: "schedDateTime",
    sortFunction: dateSort,
    sortable: true,
  },
  {
    name: "Doctor",
    selector: "doctorName",
  },
  {
    name: "Room",
    selector: "office",
  },

  {
    name: "Clinic Hours",
    selector: "clinicHours",
  },
];

const isUpcoming = (schedDate, date, time) => {
  const sDate = new Date(schedDate);
  const dateNow = new Date(date + " " + time);
  if (sDate >= dateNow) return true;
  else return false;
};

const Dashboard = () => {
  const { wish, day, date, time, month, dateNum, year } = useDate();
  const { userData } = useContext(UserContext);
  const [isLoading, setisLoading] = useState(true);
  const [schedList, setSchedList] = useState([]);

  const getScheds = () => {
    setSchedList([]);
    let token = localStorage.getItem("auth-token");
    try {
      fetch(
        `/api/patient/getSchedules/${userData.user.id}/${month}-${dateNum}-${year}`,
        {
          method: "GET",
          headers: {
            "x-auth-token": token,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.msgError) {
            console.log(data.msg);
          } else {
            data.list.map((e) => {
              const schedObj = {
                doctorInfo: e.office_id,
                date: e.date,
                timeslot: e.timeslot,
                schedDateTime: `${e.date.month} ${e.date.day}, ${e.date.year} ${e.timeslot}`,
                doctorName: `${e.office_id.lastName}, ${e.office_id.firstName}`,
                office: `Rm. ${e.office_id.address.roomNumber} ${e.office_id.address.building}`,
                clinicDays: `${e.office_id.clinicDays}`,
                clinicHours: `${e.office_id.clinicHours.start}-${e.office_id.clinicHours.end}`,
              };
              if (isUpcoming(schedObj.schedDateTime, date, time))
                return setSchedList((oldList) => [...oldList, schedObj]);
            });
          }
          setisLoading(false);
        });
    } catch (err) {
      console.log(err.response);
    }
  };

  useEffect(() => {
    getScheds();
  }, []);

  return (
    <>
      <Container className="pt-3">
        <div className="p-2 mb-3 border border-info d-flex justify-content-between">
          {`${wish} `}
          {schedList.length === 0
            ? `You have no appointments today.`
            : `You have ${schedList.length} more appointment(s) today.`}
          <b>{`${day} ${date} ${time}`}</b>
        </div>

        <Row>
          <Col>
            <DataTable
              defaultSortField="schedDateTime"
              title={
                isLoading ? "Loading Appointments..." : "Appointments Today"
              }
              columns={columns}
              data={schedList}
              pagination // optionally, a hook to reset pagination to page 1
              persistTableHead
              progressPending={isLoading}
              progressComponent={<LinearIndeterminate />}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
