import React, { useState, useEffect } from "react";
import { Col, Container, Form } from "react-bootstrap";

const PatientRecord = ({ match }) => {
  const [sched, setSched] = useState([]);
  const [record, setRecord] = useState([]);
  const [hasRecord, setHasRecord] = useState(false);

  const getSched = () => {
    let token = localStorage.getItem("auth-token");
    try {
      fetch(`/api/office/getScheduleById/${match.params.id}`, {
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
            setSched(data.sched);
            setRecord(data.record);
            setHasRecord(data.hasRecord);
            console.log(data);
          }
        });
    } catch (err) {
      console.log(err.response);
    }
  };

  useEffect(() => {
    getSched();
  }, []);
  return (
    <Container className="pt-4">
      <div className="col m-2">
        <div className="row align-bottom">
          <h5 id="accountinfo" className="mr-4">
            Patient Information
          </h5>
        </div>
        <div className="row border-top mb-3"></div>
      </div>

      <div className=" d-flex justify-content-between">
        <div className="p-2 text-break" id="patientName_div">
          Name:{" "}
          <b>
            {sched.length === 0
              ? ""
              : `${sched[0].patient_id.lastName}, ${sched[0].patient_id.firstName}`}
          </b>
        </div>
        <div className="p-2 text-break" id="patientEmail_div">
          Email:{" "}
          <b>{sched.length === 0 ? "" : `${sched[0].patient_id.email}`}</b>
        </div>
        <div className="p-2 text-break" id="patientContactNo_div">
          Contact No:{" "}
          <b>
            {sched.length === 0
              ? ""
              : sched[0].patient_id.contactNo === ""
              ? "N/A"
              : `${sched[0].patient_id.contactNo}`}
          </b>
        </div>
      </div>

      <div className=" d-flex justify-content-between">
        <div className="p-2 text-break flex-grow-1" id="patientAddress_div">
          Address:{" "}
          <b>
            {sched.length === 0
              ? ""
              : sched[0].patient_id.details.address.street === ""
              ? "N/A"
              : `${sched[0].patient_id.details.address.street}, ${sched[0].patient_id.details.address.city}, ${sched[0].patient_id.details.address.province}`}
          </b>
        </div>

        <div className="p-2 text-break" id="patientBirthdate_div">
          Birthdate:{" "}
          <b>
            {sched.length === 0
              ? ""
              : sched[0].patient_id.details.birthdate.day === ""
              ? "N/A"
              : `${sched[0].patient_id.details.birthdate.month} ${sched[0].patient_id.details.birthdate.day}, ${sched[0].patient_id.details.birthdate.year}`}
          </b>
        </div>
        <div className="p-2 text-break" id="patientSex_div">
          Sex:{" "}
          <b>
            {sched.length === 0
              ? ""
              : sched[0].patient_id.details.sex === ""
              ? "N/A"
              : `${sched[0].patient_id.details.sex}`}
          </b>
        </div>
      </div>

      <div className="col mt-4">
        <div className="row align-bottom">
          <h5 id="accountinfo" className="mr-4">
            Record
          </h5>
        </div>
        <div className="row border-top mb-3"></div>
      </div>

      <div className=" p-2" id="record form">
        <Form>
          <Form.Row>
            <Col className="p-2">
              <Form.Label>Age</Form.Label>
              <Form.Control type="text" name="firstName" />
            </Col>
            <Col className="p-2">
              <Form.Label>Weight (kilograms)</Form.Label>
              <Form.Control type="text" name="firstName" />
            </Col>
            <Col className="p-2">
              <Form.Label>Height (centimeters)</Form.Label>
              <Form.Control type="text" name="firstName" />
            </Col>
          </Form.Row>

          <Form.Row>
            <Col className="p-2">
              <Form.Label>Blood Pressure</Form.Label>
              <Form.Control type="text" name="firstName" />
            </Col>
            <Col className="p-2">
              <Form.Label>Temperature</Form.Label>
              <Form.Control type="text" name="firstName" />
            </Col>
            <Col className="p-2">
              <Form.Label>Respiration</Form.Label>
              <Form.Control type="text" name="firstName" />
            </Col>
            <Col className="p-2">
              <Form.Label>Heart Rate</Form.Label>
              <Form.Control type="text" name="firstName" />
            </Col>
          </Form.Row>

          <Form.Row className="justify-content-between">
            <Col className="p-2">
              <Form.Label>Medications</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                type="text"
                name="firstName"
                style={{ resize: "none" }}
              />
            </Col>
            <Col className="p-2">
              <Form.Label>Medical History</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                type="text"
                name="firstName"
                style={{ resize: "none" }}
              />
            </Col>
          </Form.Row>

          <Form.Row className="justify-content-between">
            <Col className="p-2">
              <Form.Label>Complaints</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                type="text"
                name="firstName"
                style={{ resize: "none" }}
              />
            </Col>
            <Col className="p-2">
              <Form.Label>Laboratory Results (if any)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                type="text"
                name="firstName"
                style={{ resize: "none" }}
              />
            </Col>
          </Form.Row>
        </Form>
      </div>
      <div className="m-5"></div>
    </Container>
  );
};

export default PatientRecord;
