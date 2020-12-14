import { Snackbar } from "@material-ui/core";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Modal, Form, Alert, Col, Row } from "react-bootstrap";
import styled from "styled-components";
import UserContext from "../../context/UserContext";
import { PrimaryButton, SecondaryButton, PrintButton } from "../../StyledComps";
import PrintIcon from "@material-ui/icons/Print";
import { useReactToPrint } from "react-to-print";

function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  } else return age;
}

const RecordModal = (props) => {
  const { userData } = useContext(UserContext);
  const { schedInfo, show, toggle, getScheds, setSnackbar, prevRecord } = props;
  const initState = {
    weight: "",
    height: "",
    bloodPressure: "",
    temperature: "",
    respiration: "",
    pulseRate: "",
    medicalHistory: "",
    symptoms: "",
    diagnosis: "",
    prescription: "",
  };
  const [open, setOpen] = useState(false);
  const [record, setRecord] = useState(initState);
  const [isEditing, setIsEditing] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const onChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const edit = () => {
    isEditing ? updateRecord() : setIsEditing(true);
  };

  const renderButton = () => {
    if (schedInfo.hasRecord) {
      return (
        <PrimaryButton onClick={edit}>
          {isEditing ? "Save" : "Edit"}
        </PrimaryButton>
      );
    } else {
      return (
        <PrimaryButton onClick={save} disabled={isSending}>
          {isSending ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            "Save"
          )}
        </PrimaryButton>
      );
    }
  };

  const updateRecord = () => {
    setIsSending(true);
    setOpen(false);

    for (const key in record) {
      if (record[key] === "") {
        setOpen(true);
        return;
      }
    }

    try {
      const token = userData.token;

      fetch(`/api/office/updateRecord`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(record),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.msgError) {
            setSnackbar({
              content: data.msg.body,
              show: true,
              variant: "error",
            });
          } else {
            setSnackbar({
              content: data.msg.body,
              show: true,
              variant: "success",
            });
          }
          setIsSending(false);
          setRecord(initState);
          toggle();
          getScheds();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const save = () => {
    setIsSending(true);
    setOpen(false);
    for (const key in record) {
      if (record[key] === "") {
        setOpen(true);
        return;
      }
    }

    try {
      if (
        schedInfo.patientInfo.details.birthdate.month === "" &&
        schedInfo.patientInfo.details.birthdate.year === ""
      )
        record.age = "N/A";
      else
        record.age = getAge(
          schedInfo.patientInfo.details.birthdate.month +
            " " +
            schedInfo.patientInfo.details.birthdate.day +
            ", " +
            schedInfo.patientInfo.details.birthdate.year
        );
      record.patient_id = schedInfo.patientInfo._id;
      record.office_id = userData.user.id;
      record.schedule_id = schedInfo._id;

      const token = userData.token;

      fetch(`/api/office/createRecord`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(record),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.msgError) {
            setSnackbar({
              content: data.msg.body,
              show: true,
              variant: "error",
            });
          } else {
            setSnackbar({
              content: data.msg.body,
              show: true,
              variant: "success",
            });
          }
          setIsSending(false);
          setRecord(initState);
          toggle();
          getScheds();
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setRecord(initState);
    setIsEditing(true);
    if (schedInfo !== undefined && schedInfo.hasRecord) {
      setIsEditing(false);
      setRecord(prevRecord);
    }
  }, [show]);

  return (
    <>
      <Modal size="lg" show={show} backdrop="static">
        <Modal.Header>
          <CardTitle>
            {schedInfo === undefined
              ? "No Schedule Selected"
              : schedInfo.hasRecord
              ? `Viewing record for: ${schedInfo.patientName}`
              : `Create Record`}
          </CardTitle>
        </Modal.Header>
        <Modal.Body ref={componentRef}>
          <Container className="row">
            <div className="col">
              <StyledLabel>
                Name:{" "}
                <b>
                  {schedInfo === undefined
                    ? "No Schedule Selected"
                    : `${schedInfo.patientName}`}
                </b>
              </StyledLabel>
            </div>
          </Container>
          <Container className="row">
            <div className="col">
              <StyledLabel>
                Email:{" "}
                <b>
                  {schedInfo === undefined
                    ? "No Schedule Selected"
                    : `${schedInfo.patientInfo.email}`}
                </b>
              </StyledLabel>
            </div>
            <div className="col">
              <StyledLabel>
                Contact No:{" "}
                <b>
                  {schedInfo === undefined
                    ? "No Schedule Selected"
                    : `${schedInfo.patientInfo.contactNo}`}
                </b>
              </StyledLabel>
            </div>
          </Container>
          <Container className="row">
            <div className="col">
              <StyledLabel>
                Address:{" "}
                <b>
                  {schedInfo === undefined
                    ? "No Schedule Selected"
                    : schedInfo.patientInfo.details.address.city === ""
                    ? "N/A"
                    : `${schedInfo.patientInfo.details.address.street}, ${schedInfo.patientInfo.details.address.city}, ${schedInfo.patientInfo.details.address.province}`}
                </b>
              </StyledLabel>
            </div>
          </Container>
          <Container className="row">
            <div className="col flex-grow-1">
              <StyledLabel>
                Birthdate:{" "}
                <b>
                  {schedInfo === undefined
                    ? "No Schedule Selected"
                    : schedInfo.patientInfo.details.birthdate.month === ""
                    ? "N/A"
                    : `${schedInfo.patientInfo.details.birthdate.month} ${schedInfo.patientInfo.details.birthdate.day}, ${schedInfo.patientInfo.details.birthdate.year}`}
                </b>
              </StyledLabel>
            </div>
            <AgeContainer className="col">
              <StyledLabel>
                Age:{" "}
                <b>
                  {schedInfo === undefined
                    ? "No Schedule Selected"
                    : schedInfo.hasRecord
                    ? record.age
                    : schedInfo.patientInfo.details.birthdate.month === "" ||
                      schedInfo.patientInfo.details.birthdate.year === ""
                    ? "N/A"
                    : `${getAge(
                        schedInfo.patientInfo.details.birthdate.month +
                          " " +
                          schedInfo.patientInfo.details.birthdate.day +
                          ", " +
                          schedInfo.patientInfo.details.birthdate.year
                      )}`}
                </b>
              </StyledLabel>
            </AgeContainer>
            <SmallContainer className="col">
              <StyledLabel>
                Sex:{" "}
                <b>
                  {schedInfo === undefined
                    ? "No Schedule Selected"
                    : schedInfo.patientInfo.details.sex === ""
                    ? "N/A"
                    : `${schedInfo.patientInfo.details.sex}`}
                </b>
              </StyledLabel>
            </SmallContainer>
            <div className="col flex-grow-1">
              <StyledLabel>
                Date:{" "}
                <b>
                  {schedInfo === undefined
                    ? "No Schedule Selected"
                    : `${schedInfo.date.month} ${schedInfo.date.day}, ${schedInfo.date.year}`}
                </b>
              </StyledLabel>
            </div>
          </Container>
          <div className="dropdown-divider" />
          <Form>
            <Form.Row>
              <Col>
                <StyledGroup>
                  <StyledLabel>Weight(kg.)</StyledLabel>
                  <StyledInput
                    disabled={!isEditing}
                    type="text"
                    placeholder=""
                    onChange={onChange}
                    value={record.weight}
                    name="weight"
                  />
                </StyledGroup>
              </Col>
              <Col>
                <StyledGroup>
                  <StyledLabel>Heigh(cm.)</StyledLabel>
                  <StyledInput
                    disabled={!isEditing}
                    type="text"
                    placeholder=""
                    onChange={onChange}
                    value={record.height}
                    name="height"
                  />
                </StyledGroup>
              </Col>
              <Col>
                <StyledGroup>
                  <StyledLabel>Blood Pressure</StyledLabel>
                  <StyledInput
                    disabled={!isEditing}
                    type="text"
                    placeholder=""
                    onChange={onChange}
                    value={record.bloodPressure}
                    name="bloodPressure"
                  />
                </StyledGroup>
              </Col>
              <Col>
                <StyledGroup>
                  <StyledLabel>Temperature(°C)</StyledLabel>
                  <StyledInput
                    disabled={!isEditing}
                    type="text"
                    placeholder=""
                    onChange={onChange}
                    value={record.temperature}
                    name="temperature"
                  />
                </StyledGroup>
              </Col>
              <Col>
                <StyledGroup>
                  <StyledLabel>Respiration</StyledLabel>
                  <StyledInput
                    disabled={!isEditing}
                    type="text"
                    placeholder=""
                    onChange={onChange}
                    value={record.respiration}
                    name="respiration"
                  />
                </StyledGroup>
              </Col>
              <Col>
                <StyledGroup>
                  <StyledLabel>Pulse</StyledLabel>
                  <StyledInput
                    disabled={!isEditing}
                    type="text"
                    placeholder=""
                    onChange={onChange}
                    value={record.pulseRate}
                    name="pulseRate"
                  />
                </StyledGroup>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col>
                <StyledGroup>
                  <StyledLabel>Symptoms</StyledLabel>
                  <StyledTextArea
                    row={3}
                    as="textarea"
                    type="text"
                    placeholder=""
                    onChange={onChange}
                    value={record.symptoms}
                    name="symptoms"
                    disabled={!isEditing}
                  />
                </StyledGroup>
              </Col>
              <Col>
                <StyledGroup>
                  <StyledLabel>Medical History/Medications</StyledLabel>
                  <StyledTextArea
                    row={3}
                    as="textarea"
                    type="text"
                    placeholder=""
                    onChange={onChange}
                    value={record.medicalHistory}
                    name="medicalHistory"
                    disabled={!isEditing}
                  />
                </StyledGroup>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col>
                <StyledGroup>
                  <StyledLabel>Diagnosis</StyledLabel>
                  <StyledTextAreaLarge
                    row={5}
                    as="textarea"
                    type="text"
                    placeholder=""
                    onChange={onChange}
                    value={record.diagnosis}
                    name="diagnosis"
                    disabled={!isEditing}
                  />
                </StyledGroup>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col>
                <StyledGroup>
                  <StyledLabel>Prescription</StyledLabel>
                  <StyledTextArea
                    row={3}
                    as="textarea"
                    type="text"
                    placeholder=""
                    onChange={onChange}
                    value={record.prescription}
                    name="prescription"
                    disabled={!isEditing}
                  />
                </StyledGroup>
              </Col>
            </Form.Row>
          </Form>
          <Alert
            show={open}
            variant="danger"
            dismissable
            onClose={() => setOpen(false)}
          >
            All Fields Required!
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          {schedInfo === undefined ? (
            ""
          ) : schedInfo.hasRecord ? (
            <PrintButton>
              <PrintIcon onClick={handlePrint} />
              Print
            </PrintButton>
          ) : (
            ""
          )}
          <SecondaryButton disabled={isSending} onClick={toggle}>
            Cancel
          </SecondaryButton>
          {schedInfo === undefined ? "No Schedule Selected" : renderButton()}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RecordModal;

const StyledLabel = styled(Form.Label)`
  color: #4886af;
  font-size: 0.9rem;
`;

const StyledInput = styled(Form.Control)`
  border: none;
  border-bottom: 2px solid #83c1e8;
  padding: 0.5rem;
  font-size: 0.9rem;
  &:focus {
    outline: none;
    border-bottom: 2px solid #4886af;
  }
`;
const StyledTextArea = styled(Form.Control)`
  min-width: 100%;
  resize: none;
  border: 2px solid #83c1e8;
  padding: 0.5rem;
  font-size: 0.9rem;
  &:focus {
    outline: none;
    border: 2px solid #4886af;
  }
`;

const StyledTextAreaLarge = styled(Form.Control)`
  min-height: 8rem;
  min-width: 100%;
  resize: none;
  border: 2px solid #83c1e8;
  padding: 0.5rem;
  font-size: 0.9rem;
  &:focus {
    outline: none;
    border: 2px solid #4886af;
  }
`;

const StyledGroup = styled(Form.Group)`
  padding: 0.5rem;
`;

const CardTitle = styled.b`
  color: #4886af;
  font-size: 1.3rem;
  font-weight: 400;
`;

const Container = styled.div`
  padding: 0.3rem 0.5rem;
  justify-content: space-between;
`;

const SmallContainer = styled.div`
  max-width: 8rem;
`;

const AgeContainer = styled.div`
  max-width: 6.5rem;
`;
