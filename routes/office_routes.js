const auth_middleware = require("../middleware/auth_middleware");
const Patient = require("../models/Patient");
const Schedule = require("../models/Schedule");
const bcrypt = require("bcryptjs");

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

router.get(
  "/getSchedules/:month-:day-:year",
  auth_middleware.office_auth,
  (req, res) => {
    const { month, day, year } = req.params;
    const user = req.user;

    Schedule.find({
      office_id: user.id,
      date: {
        month,
        day,
        year,
      },
    })
      .populate({
        path: "patient_id",
        select: "firstName lastName email contactNo",
      })
      .exec((err, list) => {
        if (err)
          return res.status(500).json({
            msg: { body: "Server Error: " + err.message },
            msgError: true,
          });
        return res.status(200).json({ list });
      });
  }
);

router.get("/getName/:id", auth_middleware.office_auth, (req, res) => {
  const _id = req.params.id;

  Office.find({ _id }, (err, user) => {
    if (err)
      return res.status(500).json({
        msg: { body: "Server Error: " + err.message },
        msgError: true,
      });

    return res.status(200).json({ user });
  }).select("firstName lastName");
});

router.put("/changePass/:id", auth_middleware.office_auth, async (req, res) => {
  const _id = req.params.id;
  const user = req.user;
  const { oldPass, newPass } = req.body;

  if (_id !== user.id)
    return res.status(403).json({
      msg: { body: "Request Forbidden." },
      msgError: true,
    });

  const userToUpdate = await Office.findOne({ _id });
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

  Office.updateOne({ _id }, { password: bcNewPass }, (err) => {
    if (err)
      return res.status(500).json({
        msg: { body: "Server Error: " + err },
        msgError: true,
      });
  });

  return res.status(200).json({
    msg: { body: "Password updated!" },
    msgError: false,
  });
});

router.get("/:id", auth_middleware.office_auth, (req, res) => {
  const _id = req.params.id;

  Office.findById({ _id }, (err, user) => {
    if (err)
      return res.status(500).json({
        msg: { body: "Server Error: " + err.message },
        msgError: true,
      });

    return res.status(200).json({ user });
  }).select("-password -role");
});

router.put("/update/:id", auth_middleware.office_auth, (req, res) => {
  const _id = req.params.id;
  const user = req.user;
  const fields = req.body;

  if (_id !== user.id)
    return res.status(403).json({
      msg: { body: "Request Forbidden." },
      msgError: true,
    });

  Office.findOneAndUpdate({ _id }, fields, (err) => {
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

module.exports = router;
