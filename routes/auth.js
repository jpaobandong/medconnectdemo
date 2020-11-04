const router = require("express").Router();
const NodeMailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");
const Office = require("../models/Office");
const Admin = require("../models/Admin");
const Verification = require("../models/Verification");
const auth_middlware = require("../middleware/auth_middleware");
require("dotenv").config();

const generateVCode = () => {
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

router.post("/register", async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    street,
    city,
    province,
  } = req.body.fields;
  const birthdate = req.body.birthdate;
  const vCode = generateVCode();
  try {
    if (
      !email ||
      !firstName ||
      !lastName ||
      !street ||
      !city ||
      !province ||
      !birthdate
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
    const dateCreated = new Date();
    const newPatient = new Patient({
      email,
      password,
      firstName,
      lastName,
      birthdate,
      address: {
        street,
        city,
        province,
      },
      createdAt: dateCreated,
    });

    const newVerification = new Verification({
      email,
      code: vCode,
      createdOn: dateCreated,
    });

    newPatient.save((err) => {
      if (err)
        return res.status(500).json({
          msg: { body: "Server Error: " + err.message },
          msgError: true,
        });

      newVerification.save((err) => {
        if (err) throw err;
      });

      transporter.sendMail(
        {
          from: '"MedConnect Admin" <medconnect.head@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "MedConnect Account Verification", // Subject line
          html:
            "<h3>Please verify your account!</h3><br/><p>Your Verification code is: " +
            vCode +
            "</p>", // html body
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

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: { body: "All fields required" }, msgError: true });
    }

    //---------------------LOOK FOR USER IN ADMINS COLLECTION-------------------//

    let user = await Admin.findOne({ email: email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ msg: { body: "Invalid credentials" }, msgError: true });
      }
      const token = jwt.sign(
        { id: user.id, role: "admin" },
        process.env.JWT_SECRET,
        {
          expiresIn: "12h",
        }
      );
      if (!token)
        return res
          .status(400)
          .json({ msg: { body: "Server error" }, msgError: true });

      return res.status(200).json({
        token: token,
        user: {
          id: user.id,
          role: "admin",
        },
      });
    }

    //---------------------LOOK FOR USER IN OFFICES COLLECTION-------------------//

    user = await Office.findOne({ email: email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ msg: { body: "Invalid credentials" }, msgError: true });
      }
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "12h",
        }
      );
      if (!token)
        return res
          .status(400)
          .json({ msg: { body: "Server error" }, msgError: true });

      return res.status(200).json({
        token: token,
        user: {
          id: user.id,
          role: user.role,
        },
      });
    }

    //---------------------LOOK FOR USER IN PATIENTS COLLECTION-------------------//

    user = await Patient.findOne({ email: email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ msg: { body: "Invalid credentials" }, msgError: true });
      }

      if (!user.isVerified) {
        return res.status(400).json({
          msg: {
            body: "Account not verified. Redirecting to verification page.",
          },
          msgError: true,
          notVerified: true,
        });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "12h",
        }
      );
      if (!token)
        return res
          .status(400)
          .json({ msg: { body: "Server error" }, msgError: true });

      return res.status(200).json({
        token: token,
        user: {
          id: user.id,
          role: user.role,
        },
      });
    }

    //---------------------IF EMAIL IS NOT IN THE DATABASE-------------------//
    return res
      .status(400)
      .json({ msg: { body: "Invalid credentials" }, msgError: true });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: { body: "Server Error: " + err.message }, msgError: true });
  }
});

router.post("/verifyAccount", async (req, res) => {
  const { email, vCode } = req.body;
  try {
    let patient = await Patient.findOne({ email: email });
    let ver = await Verification.findOne({ email: email });
    if (patient.isVerified)
      return res.status(400).json({
        msg: { body: "Account already verified. Please login" },
        msgError: true,
      });

    if (!ver && !patient.isVerified) {
      return res.status(400).json({
        msg: {
          body:
            "Cannot verify your account. Please contact admin at medconnect.head@gmail.com",
        },
        msgError: true,
      });
    }

    if (ver.code !== vCode) {
      return res.status(400).json({
        msg: {
          body: "Code incorrect please try again.",
        },
        msgError: true,
      });
    } else {
      patient.isVerified = true;
      patient.save();
      await Verification.deleteOne({ email: ver.email }, (err) => {
        if (err) throw err;
      });
      return res.status(200).json({
        msg: {
          body: "Code verified! Please login",
        },
        msgError: false,
      });
    }
  } catch (err) {
    return res.status(500).json({
      msg: { body: "Server Error: " + err.message },
      msgError: true,
    });
  }
});

router.post("/authenticateUser", auth_middlware.auth, (req, res) => {
  const user = req.user;
  if (!user)
    return res.status(400).json({
      msg: { body: "User not found" },
      msgError: true,
    });
  else {
    return res.status(200).json({
      user: user,
      msg: { body: "User not found" },
      msgError: false,
    });
  }
});

module.exports = router;
