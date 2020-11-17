import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import UserContext from "../../context/UserContext";

const Home = () => {
  const [open, setOpen] = useState(false);
  const { didDeactivate, setDidDeactivate } = useContext(UserContext);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setDidDeactivate(false);
  };

  useEffect(() => {
    if (didDeactivate) setOpen(true);
  }, []);

  return (
    <Container>
      Home Page
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          severity="success"
          onClose={handleClose}
          elevation={6}
          variant="filled"
        >
          Account Deactivated!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Home;
