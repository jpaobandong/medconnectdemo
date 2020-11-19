const auth_middleware = require("../middleware/auth_middleware");
const Office = require("../models/Office");
const Patient = require("../models/Patient");
const Schedule = require("../models/Schedule");
const bcrypt = require("bcryptjs");
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

router.get("/getDoctors/:id", auth_middleware.patient_auth, (req, res) => {
  const _id = req.params.id;

  Office.find({ _id }, (err, doctor) => {
    if (err)
      return res.status(500).json({
        msg: { body: "Server Error: " + err.message },
        msgError: true,
      });

    return res.status(200).json({ doctor });
  }).select("-password -role");
});

router.post(
  "/setAppointment",
  auth_middleware.patient_auth,
  async (req, res) => {
    const { office_id, req_date, req_timeslot } = req.body;
    const user = req.user;

    if (!office_id) {
      return res.status(500).json({
        msg: { body: "Please select a doctor" },
        msgError: true,
      });
    }

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
      dateObj: `${req_date.month}-${req_date.day}-${req_date.year}`,
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

router.get("/getSchedules/:id", auth_middleware.patient_auth, (req, res) => {
  const patient_id = req.params.id;

  Schedule.find({ patient_id }, (err, scheds) => {
    if (err)
      return res.status(500).json({
        msg: { body: "Server Error: " + err.message },
        msgError: true,
      });

    return res.status(200).json({ scheds });
  });
});

router.get("/getName/:id", auth_middleware.patient_auth, (req, res) => {
  const _id = req.params.id;

  Patient.find({ _id }, (err, user) => {
    if (err)
      return res.status(500).json({
        msg: { body: "Server Error: " + err.message },
        msgError: true,
      });

    return res.status(200).json({ user });
  }).select("firstName lastName");
});

router.get("/:id", auth_middleware.patient_auth, (req, res) => {
  const _id = req.params.id;

  Patient.findById({ _id }, (err, user) => {
    if (err)
      return res.status(500).json({
        msg: { body: "Server Error: " + err.message },
        msgError: true,
      });

    return res.status(200).json({ user });
  }).select("-password -role");
});

router.delete(
  "/deactivate/:id",
  auth_middleware.patient_auth,
  async (req, res) => {
    const _id = req.params.id;
    const user = req.user;
    const { password } = req.body;

    if (_id !== user.id)
      return res.status(403).json({
        msg: { body: "Request Forbidden." },
        msgError: true,
      });

    const userToDelete = await Patient.findOne({ _id });
    const isMatch = await bcrypt.compare(password, userToDelete.password);

    if (!isMatch)
      return res
        .status(400)
        .json({ msg: { body: "Invalid password" }, msgError: true });

    Patient.findByIdAndDelete({ _id }, (err) => {
      if (err)
        return res.status(500).json({
          msg: { body: "Server Error: " + err },
          msgError: true,
        });
    });

    return res.status(200).json({
      msg: { body: "Account deactivated!" },
      msgError: false,
    });
  }
);

router.put("/update/:id", auth_middleware.patient_auth, (req, res) => {
  const _id = req.params.id;
  const user = req.user;
  const fields = req.body;
  if (_id !== user.id)
    return res.status(403).json({
      msg: { body: "Request Forbidden." },
      msgError: true,
    });

  Patient.findOneAndUpdate({ _id }, fields, (err) => {
    if (err)
      return res.status(500).json({
        msg: { body: "Server Error: " + err },
        msgError: true,
      });
  });

  return res.status(200).json({
    msg: { body: "Account updated!" },
    msgError: false,
  });
});

router.put(
  "/changePass/:id",
  auth_middleware.patient_auth,
  async (req, res) => {
    const _id = req.params.id;
    const user = req.user;
    const { oldPass, newPass } = req.body;

    if (_id !== user.id)
      return res.status(403).json({
        msg: { body: "Request Forbidden." },
        msgError: true,
      });

    const userToUpdate = await Patient.findOne({ _id });
    const isMatch = await bcrypt.compare(oldPass, userToUpdate.password);

    if (!isMatch)
      return res
        .status(400)
        .json({ msg: { body: "Invalid password" }, msgError: true });

    const bcNewPass = bcrypt.hashSync(newPass, 10, (err) => {
      if (err)
        return res.status(500).json({
          msg: { body: "Server Error: " + err },
          msgError: true,
        });
    });

    Patient.updateOne({ _id }, { password: bcNewPass }, (err) => {
      if (err)
        return res.status(500).json({
          msg: { body: "Server Error: " + err },
          msgError: true,
        });
    });

    return res.status(200).json({
      msg: { body: "Account updated!" },
      msgError: false,
    });
  }
);

module.exports = router;
