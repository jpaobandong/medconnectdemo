import React, { useContext } from "react";
import { Route } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Unauthorized from "../pages/Unauthorized";

const GuestRoute = ({ component: Component, ...rest }) => {
  const { userData } = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!userData.user) return <Component {...props} />;
        else return <Unauthorized />;
      }}
    />
  );
};

export default GuestRoute;
