import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
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
    name: "Patient Name",
    selector: "patientName",
  },
  {
    name: "Doctor",
    selector: "doctorName",
  },
];

const AdminDash = () => {
  const { wish, day, date, time, month, dateNum, year } = useDate();
  const [schedList, setSchedList] = useState([]);

  const [isLoading, setisLoading] = useState(true);

  const getScheds = () => {
    setSchedList([]);
    let token = localStorage.getItem("auth-token");
    try {
      fetch(`/api/admin/getSchedules/${month}-${dateNum}-${year}`, {
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
                patientInfo: e.patient_id,
                doctorInfo: e.office_id,
                date: e.date,
                timeslot: e.timeslot,
                schedDateTime: `${e.date.month} ${e.date.day}, ${e.date.year} ${e.timeslot}`,
                patientName: `${e.patient_id.lastName}, ${e.patient_id.firstName}`,
                doctorName: `${e.office_id.lastName}, ${e.office_id.firstName}`,
              };
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
    <Container className="pt-3">
      <div className="p-2 mb-3 border border-info d-flex justify-content-between">
        {`${wish}`}
        <b>{`${day} ${date} ${time}`}</b>
      </div>
      <DataTable
        defaultSortField="schedDateTime"
        title={
          isLoading
            ? "Loading Appointments..."
            : "Appointments Today: " + schedList.length
        }
        columns={columns}
        data={schedList}
        pagination // optionally, a hook to reset pagination to page 1
        persistTableHead
        progressPending={isLoading}
        progressComponent={<LinearIndeterminate />}
      />
    </Container>
  );
};

export default AdminDash;
