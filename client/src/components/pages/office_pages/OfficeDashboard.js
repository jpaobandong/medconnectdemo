import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Container, Button } from "react-bootstrap";
import { useDate } from "../../hooks/useDate";
import DataTable from "react-data-table-component";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useHistory } from "react-router-dom";
import { Row, Column } from "../../../StyledComps";
import RecordModal from "../../modals/RecordModal";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

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

const RecordBtn = styled(Button)`
  font-size: 11px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

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

const OfficeDashboard = () => {
  const history = useHistory();
  const { wish, day, date, time, month, dateNum, year } = useDate();
  const [schedList, setSchedList] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [selectedSched, setSelectedSched] = useState(undefined);
  const [snackbar, setSnackbar] = useState({
    show: false,
    variant: "error",
    content: "",
  });
  const [prevRecord, setPrevRec] = useState({});

  const toggle = () => {
    setShow(!show);
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
      name: "Contact no.",
      selector: "patientInfo.contactNo",
    },
    {
      name: "Actions",
      button: true,
      cell: (row) => {
        if (row.hasRecord) {
          return (
            <RecordBtn
              onClick={() => {
                setSelectedSched(row);
                getRecord(row._id);
                /* history.push(`office/appointment/${row._id}`); */
              }}
            >
              View Record
            </RecordBtn>
          );
        } else {
          return (
            <RecordBtn
              className="btn-success"
              onClick={() => {
                setSelectedSched(row);
                toggle();
                /* history.push(`office/appointment/${row._id}`); */
              }}
            >
              Create Record
            </RecordBtn>
          );
        }
      },
    },
  ];

  const getScheds = () => {
    setSchedList([]);
    let token = localStorage.getItem("auth-token");
    try {
      fetch(`/api/office/getSchedules/${month}-${dateNum}-${year}`, {
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
                patientInfo: e.patient_id,
                date: e.date,
                timeslot: e.timeslot,
                schedDateTime: `${e.date.month} ${e.date.day}, ${e.date.year} ${e.timeslot}`,
                patientName: `${e.patient_id.lastName}, ${e.patient_id.firstName}`,
                hasRecord: e.hasRecord ? true : false,
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

  const getRecord = (sched_id) => {
    let token = localStorage.getItem("auth-token");
    try {
      fetch(`/api/office/getRecord/${sched_id}`, {
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
            setPrevRec(data.result);
          }
          toggle();
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getScheds();
  }, []);

  return (
    <Body>
      <Row className="row">
        <DateCol className="col">
          <InnerContain>
            <b>{`${day} ${date} ${time}`}</b>
          </InnerContain>
          <InnerContain>
            {`${wish} `}
            {schedList.length === 0 ? (
              <>You have no appointments today.</>
            ) : (
              `You have ${schedList.length} more appointment(s) today.`
            )}
          </InnerContain>
        </DateCol>
        <div className="col">
          <DataTable
            noHeader={true}
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
        </div>
      </Row>
      <RecordModal
        show={show}
        toggle={toggle}
        schedInfo={selectedSched}
        setSnackbar={setSnackbar}
        getScheds={getScheds}
        prevRecord={prevRecord}
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbar.show}
        autoHideDuration={6000}
        onClose={() => {
          setSnackbar({ ...snackbar, show: false });
        }}
      >
        <Alert
          severity={snackbar.variant}
          onClose={() => {
            setSnackbar({ ...snackbar, show: false });
          }}
          elevation={6}
          variant="filled"
        >
          {snackbar.content}
        </Alert>
      </Snackbar>
    </Body>
  );
};

export default OfficeDashboard;

const Body = styled.div`
  padding: 0.5rem;
  height: 100%;
`;

const DateCol = styled.div`
  max-width: 30%;
  flex-direction: column;
  justify-content: space-between;
  border: #4886af solid 2px;
  border-radius: 5px;
`;

const InnerContain = styled.div`
  padding: 0.8rem 0.3rem;
`;
