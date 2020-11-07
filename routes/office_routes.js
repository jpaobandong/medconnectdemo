const auth_middleware = require("../middleware/auth_middleware");
const Patient = require("../models/Patient");
const Schedule = require("../models/Schedule");

const router = require("express").Router();

router.get("/getPatients", auth_middleware.office_auth, (req, res) => {
  Patient.find((err, list) => {
    if (err)
      return res.status(500).json({
        msg: { body: "Server Error: " + err.message },
        msgError: true,
      });

    return res.status(200).json({ list });
  }).select("-password -role");
});

router.get("/getSchedules", auth_middleware.office_auth, (req, res) => {
  Schedule.find((err, list) => {
    if (err)
      return res.status(500).json({
        msg: { body: "Server Error: " + err.message },
        msgError: true,
      });

    return res.status(200).json({ list });
  });
});

module.exports = router;
