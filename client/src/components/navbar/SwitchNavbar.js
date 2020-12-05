import React, { useContext, useState } from "react";
import styled from "styled-components";
import UserContext from "../../context/UserContext";
import AdminNav from "./AdminNav";
import GuestNav from "./GuestNav";
import OfficeNav from "./OfficeNav";
import PatientNav from "./PatientNav";

const SwitchNavBar = () => {
  const { userData } = useContext(UserContext);

  if (userData.user) {
    switch (userData.user.role) {
      case "patient":
        return <PatientNav />;
      case "admin":
        return <AdminNav />;
      case "office":
        return <OfficeNav />;
      default:
        return <GuestNav />;
    }
  }
  return <GuestNav />;
};

export default SwitchNavBar;
