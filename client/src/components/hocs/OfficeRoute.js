import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Unauthorized from "../pages/Unauthorized";

const OfficeRoute = ({ component: Component, ...rest }) => {
  const { userData } = useContext(UserContext);
  const defaultRoutes = {
    patient: "/patient/",
    office: "/office/",
    admin: "/accounts",
  };
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!userData.user)
          return (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location },
              }}
            />
          );

        switch (userData.user.role) {
          case "office":
            return <Component {...props} />;
          case "admin":
            return (
              <Redirect
                to={{
                  pathname: defaultRoutes.admin,
                  state: { from: props.location },
                }}
              />
            );
          case "patient":
            return (
              <Redirect
                to={{
                  pathname: defaultRoutes.patient,
                  state: { from: props.location },
                }}
              />
            );
          default:
            return <Unauthorized />;
        }
      }}
    />
  );
};

export default OfficeRoute;
