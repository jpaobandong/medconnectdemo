import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import DataTable from "react-data-table-component";
import styled from "styled-components";
import UserContext from "../../../context/UserContext";
import { makeStyles } from "@material-ui/core/styles";
import { LinearProgress } from "@material-ui/core";
import ExpRowComp from "../../ExpRowComp";

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
      <LinearProgress style={{ maxWidth: "100%" }} />
      <div style={{ maxWidth: "100%", justifyContent: "center" }}>
        Getting Records
      </div>
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

const OfficeRecords = () => {
  const [myRecordsList, setMyRecordsList] = useState([]);
  const [gettingData, setGettingData] = useState(false);

  const columns = [
    {
      name: "Date & Time",
      selector: "dateTime",
      sortFunction: dateSort,
      sortable: true,
    },
    {
      name: "Patient",
      selector: "patientName",
      sortable: true,
    },
  ];

  const getRecords = () => {
    setGettingData(true);
    setMyRecordsList([]);

    try {
      let token = localStorage.getItem("auth-token");
      fetch(`/api/office/getAllRecords`, {
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
            data.msg.body.map((e) => {
              const recordObj = {
                ...e,
                patientName: `${e.patient_id.firstName}, ${e.patient_id.lastName}`,
                dateTime: `${e.schedule_id.date.month} ${e.schedule_id.date.day}, ${e.schedule_id.date.year} ${e.schedule_id.timeslot}`,
              };

              return setMyRecordsList((oldList) => [...oldList, recordObj]);
            });
            setGettingData(false);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRecords();
  }, []);

  return (
    <StyledContainer>
      <DataTable
        noHeader={true}
        defaultSortField="dateTime"
        columns={columns}
        data={myRecordsList}
        pagination
        progressPending={gettingData}
        progressComponent={<LinearIndeterminate />}
        expandableRows
        expandableRowsComponent={<ExpRowComp />}
        expandOnRowClicked
      />
    </StyledContainer>
  );
};

export default OfficeRecords;

const StyledContainer = styled(Container)`
  margin: 0;
  padding: 1.5rem;
  justify-content: center;
  min-height: 100vh;
  justify-content: center;
`;
