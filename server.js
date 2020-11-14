//imports
const express = require("express");
const mongoose = require("mongoose");
const api = require("./routes/api");
const auth_routes = require("./routes/auth");
const patient_routes = require("./routes/patient_routes");
const admin_routes = require("./routes/admin_routes");
const office_routes = require("./routes/office_routes");
require("dotenv").config();

//#initialize express framework-------express handles most of the process we'll be running
const app = express();

//#use express json parser
app.use(express.json());

//check for the assigned PORT from host or assign it to port 5000
const PORT = process.env.PORT || 5000;

//start the server and listen for requests
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});

//connect to mongodb atlas with the conenction string in the .env file
mongoose.connect(
  process.env.MONGODB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to DB");
  }
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

/* app.use("/auth", auth_routes);
app.use("/patient", patient_routes);
app.use("/admin", admin_routes);
app.use("/office", office_routes); */
app.use("/api", api);
