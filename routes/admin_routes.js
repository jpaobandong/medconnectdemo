const auth_middleware = require("../middleware/auth_middleware");
const NodeMailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Office = require("../models/Office");
const Patient = require("../models/Patient");
const { errorMonitor } = require("nodemailer/lib/mailer");
const Schedule = require("../models/Schedule");
const router = require("express").Router();
require("dotenv").config();

const generatePass = () => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 20; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const transporter = NodeMailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PW,
  },
});

router.post("/registerOffice", auth_middleware.admin_auth, async (req, res) => {
  const {
    email,
    firstName,
    lastName,
    street,
    city,
    province,
    roomNumber,
    building,
    specialization,
    contactNo,
  } = req.body.fields;
  const { hours, days } = req.body;
  const pass = generatePass();

  try {
    if (
      !email ||
      !firstName ||
      !lastName ||
      !street ||
      !city ||
      !province ||
      !roomNumber ||
      !building ||
      !contactNo ||
      !specialization
    ) {
      return res
        .status(400)
        .json({ msg: { body: "All fields required" }, msgError: true });
    }
    //---------------------check if the email supplied is already in the patients collection
    var account = await Patient.findOne({ email: email }, (err) => {
      if (err)
        return res.status(500).json({
          msg: { body: "Server Error: " + err.message },
          msgError: true,
        });
    });

    if (account) {
      return res.status(400).json({
        msg: { body: "Email already taken!" },
        msgError: true,
      });
    }

    //---------------------check if the email supplied is already in the offices collection
    account = await Office.findOne({ email: email }, (err) => {
      if (err)
        return res.status(500).json({
          msg: { body: "Server Error: " + err.message },
          msgError: true,
        });
    });

    if (account) {
      return res.status(400).json({
        msg: { body: "Email already taken!" },
        msgError: true,
      });
    }

    //---------------------check if the email supplied is already in the admins collection
    account = await Admin.findOne({ email: email }, (err) => {
      if (err)
        return res.status(500).json({
          msg: { body: "Server Error: " + err.message },
          msgError: true,
        });
    });

    if (account) {
      return res.status(400).json({
        msg: { body: "Email already taken!" },
        msgError: true,
      });
    }

    const newOffice = new Office({
      firstName,
      lastName,
      email,
      password: pass,
      address: {
        roomNumber,
        building,
        street,
        city,
        province,
      },
      specialization,
      contactNo,
      clinicHours: hours,
      clinicDays: days,
    });

    newOffice.save((err) => {
      if (err)
        return res.status(500).json({
          msg: { body: "Server Error: " + err.message },
          msgError: true,
        });

      transporter.sendMail(
        {
          from: '"MedConnect Admin" <medconnect.head@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "MedConnect Account Verification", // Subject line
          html:
            "<h3>Your email has been registered to MedConnect.</h3><br/><p>Your password is: " +
            pass +
            ". Please change your password upon logging in.</p>", // html body
        },
        (err) => {
          if (err) console.log(err);
        }
      );
      return res.status(200).json({
        msg: {
          body:
            "Account created! Please check your email for the verification code before logging in. Redirecting...",
        },
        msgError: false,
      });
    });
  } catch (err) {
    res
      .status(500)
      .json({ msg: { body: "Server Error: " + err.message }, msgError: true });
  }
});

router.get("/getOffices", auth_middleware.admin_auth, (req, res) => {
  Office.find((err, list) => {
    if (err)
      return res.status(500).json({
        msg: { body: "Server Error: " + err.message },
        msgError: true,
      });

    return res.status(200).json({ list });
  }).select("-password -role");
});

router.get("/getPatients", auth_middleware.admin_auth, (req, res) => {
  Patient.find((err, list) => {
    if (err)
      return res.status(500).json({
        msg: { body: "Server Error: " + err.message },
        msgError: true,
      });

    return res.status(200).json({ list });
  }).select("-password -role");
});

router.get(
  "/appointment/:month-:day-:year",
  auth_middleware.admin_auth,
  (req, res) => {
    const { month, day, year } = req.params;

    Schedule.find({ date: { month, day, year } }, (err, list) => {
      if (err)
        return res.status(500).json({
          msg: { body: "Server Error: " + err.message },
          msgError: true,
        });

      return res.status(200).json({ list });
    });
  }
);

router.get("/getSchedules/:month-:day-:year", (req, res) => {
  const { month, day, year } = req.params;

  Schedule.find({
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
    .populate({
      path: "office_id",
      select: "firstName lastName email contactNo specialization",
    })
    .exec((err, list) => {
      if (err)
        return res.status(500).json({
          msg: { body: "Server Error: " + err.message },
          msgError: true,
        });
      return res.status(200).json({ list });
    });
});

module.exports = router;
