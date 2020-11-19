import React, { useState } from "react";
import { Modal, Button, Form, Col, Alert } from "react-bootstrap";
import { useDate } from "../hooks/useDate";

const NewOfficeModal = (props) => {
  const { date } = useDate();
  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    specialization: "",
    contactNo: "",
    roomNumber: "",
    building: "",
    street: "",
    city: "",
    province: "",
  });
  let days = [];
  const [alertContent, setAlertContent] = useState({
    content: "",
    show: false,
    variant: "danger",
  });
  const [CBGroup, setCBGroup] = useState({
    mondayCB: "",
    tuesdayCB: "",
    wednesdayCB: "",
    thursdayCB: "",
    fridayCB: "",
    saturdayCB: "",
    sundayCB: "",
  });
  const [hours, setHours] = useState({ start: "9:00 AM", end: "9:00 AM" });
  const onChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const CBhandleChange = (e) => {
    if (e.target.checked)
      setCBGroup({ ...CBGroup, [e.target.name]: e.target.value });
    else setCBGroup({ ...CBGroup, [e.target.name]: "" });
  };

  const DDhandleChange = (e) => {
    setHours({ ...hours, [e.target.name]: e.target.value });
  };

  const onClickSubmit = (e) => {
    let data = {};
    const hStart = new Date(date + " " + hours.start);
    const hEnd = new Date(date + " " + hours.end);
    days = [];

    if (CBGroup.mondayCB !== "") days.push(CBGroup.mondayCB);
    if (CBGroup.tuesdayCB !== "") days.push(CBGroup.tuesdayCB);
    if (CBGroup.wednesdayCB !== "") days.push(CBGroup.wednesdayCB);
    if (CBGroup.thursdayCB !== "") days.push(CBGroup.thursdayCB);
    if (CBGroup.fridayCB !== "") days.push(CBGroup.fridayCB);
    if (CBGroup.saturdayCB !== "") days.push(CBGroup.saturdayCB);
    if (CBGroup.sundayCB !== "") days.push(CBGroup.sundayCB);

    let token = localStorage.getItem("auth-token");

    //verify if the fields are empty
    if (
      fields.email === "" ||
      fields.firstName === "" ||
      fields.lastName === "" ||
      fields.street === "" ||
      fields.city === "" ||
      fields.province === "" ||
      fields.roomNumber === "" ||
      fields.building === "" ||
      fields.contactNo === "" ||
      fields.specialization === ""
    ) {
      setAlertContent({
        show: true,
        content: "All fields required!",
        variant: "danger",
      });
    } else if (days.length === 0) {
      setAlertContent({
        content: "Select at least one clinic day.",
        show: true,
        variant: "danger",
      });
    } else if (hStart >= hEnd) {
      setAlertContent({
        content: "End time should be later than the start time.",
        show: true,
        variant: "danger",
      });
    } else {
      data = { fields, hours, days };
      try {
        fetch("/api/admin/registerOffice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (data.msgError) {
              setAlertContent({
                content: data.msg.body,
                show: true,
                variant: "danger",
              });
            } else {
              props.snackopen();
              props.reloadList();
              props.toggle();
            }
          });
      } catch (err) {
        setAlertContent({
          content: err.msg,
          show: true,
          variant: "danger",
        });
      }
    }
  };

  const initTimeSlots = () => {
    let options = [
      "09:00 AM",
      "09:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "12:00 PM",
      "12:30 PM",
      "01:00 PM",
      "01:30 PM",
      "02:00 PM",
      "02:30 PM",
      "03:00 PM",
      "03:30 PM",
      "04:00 PM",
      "04:30 PM",
      "05:00 PM",
      "05:30 PM",
    ];

    return options.map((e) => {
      return (
        <option key={e} value={e}>
          {e}
        </option>
      );
    });
  };

  return (
    <Modal show={props.show} className="p-3" backdrop="static">
      <Modal.Header>
        <b>Create New Office Account</b>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* ==========NAME=============== */}
          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Juan"
                  onChange={onChange}
                  value={fields.firstName}
                  name="firstName"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Dela Cruz"
                  onChange={onChange}
                  value={fields.lastName}
                  name="lastName"
                />
              </Form.Group>
            </Col>
          </Form.Row>
          {/* ==========EMAIL============== */}
          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label>Email address</Form.Label>

                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  onChange={onChange}
                  value={fields.email}
                  name="email"
                />
                <Form.Text className="text-muted">
                  An autogenerated password will be sent to the email provided.
                </Form.Text>
              </Form.Group>
            </Col>
          </Form.Row>
          {/* ==========SPECIALIZATION===== */}
          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label>Specialization</Form.Label>
                <Form.Control
                  type="text"
                  name="specialization"
                  value={fields.specialization}
                  onChange={onChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="+639012345678"
                  name="contactNo"
                  value={fields.contactNo}
                  onChange={onChange}
                />
              </Form.Group>
            </Col>
          </Form.Row>
          {/* ==========OFFICE DAYS======== */}
          <Form.Row className="mb-1">
            <Col>
              <Form.Group>
                <Form.Label>Clinic Days</Form.Label>
                <Form.Row className="justify-content-around">
                  <Form.Check
                    className="mr-3 ml-3 mt-2 mb-2"
                    inline
                    onChange={CBhandleChange}
                    label="Monday"
                    type="checkbox"
                    value="Monday"
                    name="mondayCB"
                  />
                  <Form.Check
                    className="mr-3 ml-3 mt-2 mb-2"
                    inline
                    onChange={CBhandleChange}
                    label="Tuesday"
                    type="checkbox"
                    value="Tuesday"
                    name="tuesdayCB"
                  />
                  <Form.Check
                    className="mr-3 ml-3 mt-2 mb-2"
                    inline
                    onChange={CBhandleChange}
                    label="Wednesday"
                    type="checkbox"
                    value="Wednesday"
                    name="wednesdayCB"
                  />
                  <Form.Check
                    className="mr-3 ml-3 mt-2 mb-2"
                    inline
                    onChange={CBhandleChange}
                    label="Thursday"
                    type="checkbox"
                    value="Thursday"
                    name="thursdayCB"
                  />
                  <Form.Check
                    className="mr-3 ml-3 mt-2 mb-2"
                    inline
                    onChange={CBhandleChange}
                    label="Friday"
                    type="checkbox"
                    value="Friday"
                    name="fridayCB"
                  />
                  <Form.Check
                    className="mr-3 ml-3 mt-2 mb-2"
                    inline
                    onChange={CBhandleChange}
                    label="Saturday"
                    type="checkbox"
                    value="Saturday"
                    name="saturdayCB"
                  />
                  <Form.Check
                    className="mr-3 ml-3 mt-2 mb-2"
                    inline
                    onChange={CBhandleChange}
                    label="Sunday"
                    type="checkbox"
                    value="Sunday"
                    name="sundayCB"
                  />
                </Form.Row>
              </Form.Group>
            </Col>
          </Form.Row>
          {/* ==========OFFICE HOURS======= */}
          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label>Clinic Hours</Form.Label>
                <Form.Row className="text-center">
                  <div className="col-1">
                    <Form.Label className="pt-1">Start</Form.Label>
                  </div>

                  <Col>
                    <Form.Control
                      onChange={DDhandleChange}
                      name="start"
                      as="select"
                      value={hours.start}
                    >
                      {initTimeSlots()}
                    </Form.Control>
                  </Col>
                  <div className="col-1">
                    <Form.Label className="pt-1">End</Form.Label>
                  </div>

                  <Col>
                    <Form.Control
                      onChange={DDhandleChange}
                      name="end"
                      as="select"
                      value={hours.end}
                    >
                      {initTimeSlots()}
                    </Form.Control>
                  </Col>
                </Form.Row>
              </Form.Group>
            </Col>
          </Form.Row>
          {/* ==========ADDRESS 1========== */}
          <Form.Row>
            <Col md={2} lg={2} sm={2} xs={2}>
              <Form.Group>
                <Form.Label>Rm. #</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="101"
                  onChange={onChange}
                  value={fields.roomNumber}
                  name="roomNumber"
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group>
                <Form.Label>Building</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Main Building"
                  onChange={onChange}
                  value={fields.building}
                  name="building"
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group>
                <Form.Label>Street Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="101 Rizal street"
                  onChange={onChange}
                  value={fields.street}
                  name="street"
                />
              </Form.Group>
            </Col>
          </Form.Row>
          {/* =============ADDRESS 2======= */}
          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Dagupan"
                  onChange={onChange}
                  value={fields.city}
                  name="city"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Province</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Pangasinan"
                  onChange={onChange}
                  value={fields.province}
                  name="province"
                />
              </Form.Group>
            </Col>
          </Form.Row>
        </Form>

        <Alert show={alertContent.show} variant={alertContent.variant}>
          {alertContent.content}
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.toggle}>
          Close
        </Button>
        <Button variant="primary" onClick={onClickSubmit}>
          Create Account
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default NewOfficeModal;
