import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../../context/UserContext";
import { useDate } from "../../hooks/useDate";
import DataTable from "react-data-table-component";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import { Snackbar, LinearProgress } from "@material-ui/core/";
import CloseIcon from "@material-ui/icons/Close";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Row, Column } from "../../../StyledComps";
import HospitalBG from "../../../img/HospitalBG.jpg";

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
    name: "Specialization",
    selector: "specialization",
  },
  {
    name: "Room",
    selector: "office",
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
  const [open, setOpen] = useState(false);

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
                specialization: e.office_id.specialization,
                date: e.date,
                timeslot: e.timeslot,
                schedDateTime: `${e.date.month} ${e.date.day}, ${e.date.year} ${e.timeslot} `,
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

  const getPatient = () => {
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
            if (
              data.user.details.birthdate.month === "" ||
              data.user.details.birthdate.day === "" ||
              data.user.details.birthdate.year === "" ||
              data.user.details.address.street === "" ||
              data.user.details.address.city === "" ||
              data.user.details.address.province === "" ||
              data.user.details.sex === ""
            )
              setOpen(true);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getScheds();
    getPatient();
  }, []);

  return (
    <>
      <Body>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={open}
          autoHideDuration={6000}
          onClose={() => {
            setOpen(false);
          }}
        >
          <Alert
            severity="warning"
            onClose={() => {
              setOpen(false);
            }}
            elevation={6}
            variant="filled"
          >
            In order for us to help you better, complete your profile{" "}
            <b>
              <Link to="/patient/profile">here</Link>
            </b>
            .
          </Alert>
        </Snackbar>

        <Row className="row">
          <DateCol className="col">
            <InnerContain className="row">
              <b>{`${day} ${date} ${time}`}</b>
            </InnerContain>
            <InnerContain className="row">
              {`${wish} `}
              {schedList.length === 0 ? (
                <>You have no appointments today.</>
              ) : (
                `Appointments today: ${schedList.length}`
              )}
            </InnerContain>
          </DateCol>
          <div className="col">
            <DataTable
              noDataComponent={<Empty />}
              noHeader={true}
              defaultSortField="schedDateTime"
              columns={columns}
              data={schedList}
              pagination // optionally, a hook to reset pagination to page 1
              persistTableHead
              progressPending={isLoading}
              progressComponent={<LinearIndeterminate />}
            />
          </div>
        </Row>
      </Body>
    </>
  );
};

export default Dashboard;

const Body = styled.div`
  padding: 0.5rem;
  min-height: 100vh;
`;

const DateCol = styled.div`
  /* padding: 0rem 0.8rem; */
  max-width: 400px;
  flex-direction: column;
  justify-content: space-between;
  border: #4886af solid 2px;
  border-radius: 5px;
`;

const InnerContain = styled.div`
  padding: 0.8rem 0.3rem;
  margin: 0rem 0.3rem;
`;

const Empty = () => {
  return (
    <InnerContain>
      <p>
        No appointments for today. Set one{" "}
        {<Link to="/patient/appointments">here.</Link>}
      </p>
    </InnerContain>
  );
};
