const auth_middleware = require("../middleware/auth_middleware");
const Patient = require("../models/Patient");
const Schedule = require("../models/Schedule");
const bcrypt = require("bcryptjs");
const Record = require("../models/Record");

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

router.get("/getAllRecords", auth_middleware.office_auth, (req, res) => {
  Record.find({}, (err, list) => {
    if (err)
      return res.status(500).json({
        msg: { body: "Server Error: " + err },
        msgError: true,
      });

    return res.status(200).json({
      msg: { body: list },
      msgError: false,
    });
  })
    .populate({
      path: "office_id",
      select: "-password",
    })
    .populate({
      path: "patient_id",
      select: "-password",
    })
    .populate({
      path: "schedule_id",
    });
});

router.get("/getSchedules", auth_middleware.office_auth, (req, res) => {
  const user = req.user;

  Schedule.find({ office_id: user.id }, (err, list) => {
    if (err)
      return res.status(500).json({
        msg: { body: "Server Error: " + err.message },
        msgError: true,
      });

    return res.status(200).json({ list });
  }).populate({
    path: "patient_id",
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
        select: "_id firstName lastName email contactNo details medHist",
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

router.get(
  "/getScheduleById/:id",
  auth_middleware.office_auth,
  async (req, res) => {
    const user = req.user;
    const id = req.params.id;

    const sched = await Schedule.find(
      { _id: id, office_id: user.id },
      (err) => {
        if (err)
          return res.status(500).json({
            msg: { body: "Server Error: " + err.message },
            msgError: true,
          });
      }
    ).populate("patient_id");

    const record = await Record.find({ schedule_id: id }, (err) => {
      if (err)
        return res.status(500).json({
          msg: { body: "Server Error: " + err.message },
          msgError: true,
        });
    }).populate("schedule_id");

    if (record.length === 0)
      return res.status(200).json({ sched, record, hasRecord: false });
    else return res.status(200).json({ sched, record, hasRecord: true });
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

router.post("/createRecord", auth_middleware.office_auth, async (req, res) => {
  const record = new Record(req.body);

  record.save((err) => {
    if (err)
      return res.status(500).json({
        msg: { body: "Server Error: " + err.message },
        msgError: true,
      });
    else {
      Schedule.findByIdAndUpdate(
        record.schedule_id,
        { hasRecord: true },
        { returnOriginal: false },
        (err) => {
          if (err)
            return res.status(500).json({
              msg: { body: "Server Error: " + err.message },
              msgError: true,
            });

          return res.status(200).json({
            msg: { body: "Record Created!" },
            msgError: false,
          });
        }
      );
    }
  });
});

router.put("/updateRecord", auth_middleware.office_auth, (req, res) => {
  const record = new Record(req.body);

  Record.findOneAndUpdate({ _id: record._id }, record, (err) => {
    if (err)
      return res.status(500).json({
        msg: { body: "Server Error: " + err.message },
        msgError: true,
      });
    else
      return res.status(200).json({
        msg: { body: "Record Updated!" },
        msgError: false,
      });
  });
});

router.get(
  "/getRecord/:schedule_id",
  auth_middleware.office_auth,
  (req, res) => {
    const { schedule_id } = req.params;

    Record.findOne({ schedule_id }, (err, result) => {
      if (err)
        return res.status(500).json({
          msg: { body: "Server Error: " + err.message },
          msgError: true,
        });

      return res.status(200).json({ result });
    });
  }
);

router.get("/getUser/:id", auth_middleware.office_auth, (req, res) => {
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

module.exports = router;
