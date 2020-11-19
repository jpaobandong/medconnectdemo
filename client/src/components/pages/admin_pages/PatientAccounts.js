import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Container, Row, Button } from "react-bootstrap";
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

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <TextField
      id="search"
      type="text"
      placeholder="Filter By Name"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
    />
    <ClearButton type="button" onClick={onClear}>
      X
    </ClearButton>
  </>
);

const columns = [
  {
    name: "Name",
    selector: "name",
    sortable: true,
  },
  {
    name: "Email",
    selector: "email",
    sortable: false,
  },
  {
    name: "Contact Number",
    selector: "contactNo",
  },
];

const PatientAccounts = () => {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const [list, setList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const filtered = list.filter(
    (patient) =>
      patient.name &&
      patient.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const getPatientAccounts = () => {
    setList([]);
    let token = localStorage.getItem("auth-token");
    try {
      fetch("/api/admin/getPatients", {
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
              const patientObj = {
                name: `${e.lastName}, ${e.firstName}`,
                email: e.email,
                contactNo: e.contactNo,
                address: `${e.details.address.street}, ${e.details.address.city}, ${e.details.address.province}`,
              };
              return setList((oldList) => [...oldList, patientObj]);
            });
          }
          setIsLoaded(true);
        });
    } catch (err) {
      console.log(err.response);
    }
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
      />
    );
  }, [filterText, resetPaginationToggle]);

  useEffect(() => {
    getPatientAccounts();
  }, []);

  return (
    <>
      <Container className="p-5">
        <Row className="justify-content-between">
          <DataTable
            defaultSortField="name"
            title={isLoaded ? "Patients" : "Loading Patients"}
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
    </>
  );
};

export default PatientAccounts;
