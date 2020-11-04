import React from "react";
import { Switch, useRouteMatch } from "react-router-dom";
import Appointments from "../../pages/patient_pages/Appointments";
import DoctorsList from "../../pages/patient_pages/DoctorsList";
import Records from "../../pages/patient_pages/Records";
import PatientRoute from "../PatientRoute";

const PatientRouter = () => {
  let { parentPath } = useRouteMatch();

  return (
    <>
      <PatientRoute
        path={`${parentPath}/appointments`}
        component={Appointments}
      />
      <PatientRoute
        path={`${parentPath}/doctorslist`}
        component={DoctorsList}
      />
      <PatientRoute path={`${parentPath}/records`} component={Records} />
    </>
  );
};
export default PatientRouter;
