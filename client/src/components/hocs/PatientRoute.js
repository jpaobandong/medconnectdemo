import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Unauthorized from "../pages/Unauthorized";

const PatientRoute = ({ component: Component, ...rest }) => {
  const { userData } = useContext(UserContext);

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

        if (userData.user.role === "patient") return <Component {...props} />;

        return <Unauthorized />;
      }}
    />
  );
};

export default PatientRoute;
