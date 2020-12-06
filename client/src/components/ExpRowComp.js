import React from "react";
import { Col, Row } from "react-bootstrap";
import styled from "styled-components";

const ExpRowComp = (props) => {
  const record = props.data;
  return (
    <Container>
      <StyledRow>
        <StyledCol>
          Doctor: <b>{record.doctorName}</b>
        </StyledCol>
        <StyledCol>
          Date: <b>{record.dateTime}</b>
        </StyledCol>
      </StyledRow>
      <StyledRow>
        <StyledCol>
          Patient:{" "}
          <b>
            {record.patient_id.firstName + ", " + record.patient_id.lastName}
          </b>
        </StyledCol>
      </StyledRow>
      <StyledRow>
        <StyledCol>
          Address:{" "}
          <b>
            {record.patient_id.details.address.street === "" &&
            record.patient_id.details.address.city === "" &&
            record.patient_id.details.address.province === ""
              ? "N/A"
              : `${record.patient_id.details.address.street}, ${record.patient_id.details.address.city}, ${record.patient_id.details.address.province}`}
          </b>
        </StyledCol>
      </StyledRow>
      <StyledRow>
        <StyledCol>
          Email: <b>{record.patient_id.email}</b>
        </StyledCol>
        <StyledCol>
          Contact No: <b>{record.patient_id.contactNo}</b>
        </StyledCol>
      </StyledRow>
      <StyledRow>
        <StyledCol>
          Birthday:{" "}
          <b>
            {record.patient_id.details.birthdate.month === "" &&
            record.patient_id.details.birthdate.year === ""
              ? "N/A"
              : `${record.patient_id.details.birthdate.month} ${record.patient_id.details.birthdate.day}, ${record.patient_id.details.birthdate.year}`}
          </b>
        </StyledCol>
        <StyledCol>
          Age: <b>{record.age}</b>
        </StyledCol>
        <StyledCol>
          Sex:{" "}
          <b>
            {record.patient_id.details.sex === ""
              ? "N/A"
              : record.patient_id.details.sex}
          </b>
        </StyledCol>
      </StyledRow>

      <Divider />
      <StyledRow>
        <StyledCol>
          Weight (in kg.): <b>{record.weight}</b>
        </StyledCol>
        <StyledCol>
          Height (in cm.): <b>{record.height}</b>
        </StyledCol>
      </StyledRow>

      <StyledRow>
        <StyledCol>
          Blood Pressure: <b>{record.bloodPressure}</b>
        </StyledCol>
        <StyledCol>
          Temperature: <b>{record.temperature}</b>
        </StyledCol>
        <StyledCol>
          Respiration: <b>{record.respiration}</b>
        </StyledCol>
        <StyledCol>
          Pulse Rate: <b>{record.pulseRate}</b>
        </StyledCol>
      </StyledRow>

      <StyledRow>
        <StyledCol>
          <StyledRow>Symptoms: </StyledRow>
          <StyledRow className="text-wrap">
            <b>{record.symptoms}</b>
          </StyledRow>
        </StyledCol>
        <StyledCol>
          <StyledRow>Medical History: </StyledRow>
          <StyledRow className="text-wrap">
            <b>{record.medicalHistory}</b>
          </StyledRow>
        </StyledCol>
      </StyledRow>

      <StyledRow>
        <StyledCol>
          <StyledRow>Diagnosis: </StyledRow>
          <StyledRow className="text-wrap">
            <b>{record.diagnosis}</b>
          </StyledRow>
        </StyledCol>
      </StyledRow>

      <StyledRow>
        <StyledCol>
          <StyledRow>Prescription: </StyledRow>
          <StyledRow className="text-wrap">
            <b>{record.prescription}</b>
          </StyledRow>
        </StyledCol>
      </StyledRow>
    </Container>
  );
};

export default ExpRowComp;

const Container = styled.div`
  padding: 1rem 2rem;
  border: #4886af solid 2px;
`;

const StyledRow = styled(Row)`
  padding: 0.5rem 0.3rem;
`;

const StyledCol = styled(Col)``;

const Divider = styled.div`
  width: 100%;
  border-bottom: solid #4886af 1px;
  margin: 1rem 0;
`;
