const auth_middleware = require("../middleware/auth_middleware");
const Office = require("../models/Office");
const Schedule = require("../models/Schedule");

const router = require("express").Router();

router.get("/getDoctors", auth_middleware.patient_auth, (req, res) => {
  Office.find((err, list) => {
    if (err)
      return res.status(500).json({
        msg: { body: "Server Error: " + err.message },
        msgError: true,
      });

    return res.status(200).json({ list });
  }).select("-password -role");
});

router.post(
  "/setAppointment",
  auth_middleware.patient_auth,
  async (req, res) => {
    const { office_id, req_date, req_timeslot } = req.body;
    const user = req.user;

    const sched = await Schedule.findOne(
      {
        date: req_date,
        timeslot: req_timeslot,
      },
      (err) => {
        if (err)
          return res.status(500).json({
            msg: { body: "Server Error: " + err.message },
            msgError: true,
          });
      }
    );
    if (sched)
      return res.status(400).json({
        msg: { body: "Timeslot already taken" },
        msgError: true,
      });

    const newSched = new Schedule({
      patient_id: user.id,
      office_id: office_id,
      date: req_date,
      timeslot: req_timeslot,
      createdOn: new Date(),
    });
    newSched.save((err) => {
      if (err)
        return res.status(500).json({
          msg: { body: "Server Error: " + err.message },
          msgError: true,
        });
    });
    return res.status(200).json({
      msg: { body: "Appointment set! " },
      msgError: false,
    });
  }
);

router.get("/getSchedules", auth_middleware.patient_auth, (req, res) => {
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
