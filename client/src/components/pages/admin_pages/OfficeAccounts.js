import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { Container, Row, Button } from "react-bootstrap";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import DataTable from "react-data-table-component";
import NewOfficeModal from "../../modals/NewOfficeModal";
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

const ClearButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
        columns={columns}
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;
`;

const FilterComponent = ({ filterText, onFilter, onClear, toggleMod }) => (
  <>
    <TextField
      id="search"
      type="text"
      placeholder="Filter By Name"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
    />
    <ClearButton className="mr-3" type="button" onClick={onClear}>
      X
    </ClearButton>
    <Button onClick={toggleMod}>Add an Office Account</Button>
  </>
);

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
    name: "Email",
    selector: "email",
    sortable: false,
  },
  {
    name: "Phone Number",
    selector: "contactNo",
    sortable: false,
  },
];

const OfficeAccounts = () => {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const filtered = list.filter(
    (doctor) =>
      doctor.name &&
      doctor.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const getDoctorsList = () => {
    setList([]);
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
              const docObj = {
                name: `${e.lastName}, ${e.firstName}`,
                specialization: e.specialization,
                email: e.email,
                contactNo: e.contactNo,
                days: e.clinicDays,
                time: `${e.clinicHours.start}-${e.clinicHours.end}`,
                office: `${e.address.roomNumber} ${e.address.building}`,
              };
              return setList((oldList) => [...oldList, docObj]);
            });
          }
          setIsLoaded(true);
        });
    } catch (err) {
      console.log(err.response);
    }
  };

  const toggleMod = () => {
    setShowModal(!showModal);
  };

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
        toggleMod={toggleMod}
      />
    );
  }, [filterText, resetPaginationToggle]);

  useEffect(() => {
    getDoctorsList();
  }, []);

  return (
    <>
      <Container className="p-5">
        <Row className="justify-content-between"></Row>
        <Row>
          <DataTable
            defaultSortField="name"
            title={isLoaded ? "Doctors" : "Loading Doctors"}
            columns={columns}
            data={filtered}
            pagination
            paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
            persistTableHead
            progressPending={!isLoaded}
            progressComponent={<LinearIndeterminate />}
          />
        </Row>
      </Container>

      <NewOfficeModal
        snackOpen={handleClose}
        show={showModal}
        toggle={toggleMod}
        reloadList={getDoctorsList}
      />

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          severity="success"
          onClose={handleClose}
          elevation={6}
          variant="filled"
        >
          Doctor added!
        </Alert>
      </Snackbar>
    </>
  );
};
export default OfficeAccounts;
