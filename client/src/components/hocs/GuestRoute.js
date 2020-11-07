import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Unauthorized from "../pages/Unauthorized";

const GuestRoute = ({ component: Component, ...rest }) => {
  const { userData } = useContext(UserContext);
  const defaultRoutes = {
    patient: "/patient/appointments",
    office: "/office/appointments",
    admin: "/accounts",
  };
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!userData.user) return <Component {...props} />;
        else {
          switch (userData.user.role) {
            case "patient":
              return (
                <Redirect
                  to={{
                    pathname: defaultRoutes.patient,
                    state: { from: props.location },
                  }}
                />
              );
            case "admin":
              return (
                <Redirect
                  to={{
                    pathname: defaultRoutes.admin,
                    state: { from: props.location },
                  }}
                />
              );
            case "office":
              return (
                <Redirect
                  to={{
                    pathname: defaultRoutes.office,
                    state: { from: props.location },
                  }}
                />
              );
            default:
              return <Unauthorized />;
          }
        }
      }}
    />
  );
};

export default GuestRoute;
