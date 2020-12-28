//imports
const express = require("express");
const mongoose = require("mongoose");
const api = require("./routes/api");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
/* const { createDoctors, createPatients } = require("./dummyscript"); */

//#initialize express framework-------express handles most of the process we'll be running
const app = express();

app.use(cors());
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
    /* createPatients(100);*/
    /* createDoctors(3); */
  }
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  /* app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  }); */
}

app.use("/api", api);
