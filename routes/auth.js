const router = require("express").Router();
const NodeMailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");
const Office = require("../models/Office");
const Admin = require("../models/Admin");
const Verification = require("../models/Verification");
const auth_middlware = require("../middleware/auth_middleware");
const fs = require("fs");
const handlebars = require("handlebars");
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

var readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      throw err;
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

router.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body.fields;

  const vCode = generateVCode();
  try {
    if (!email || !firstName || !lastName || !password) {
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

      readHTMLFile(__dirname + "/emailverification.html", function (err, html) {
        if (err) throw err;
        var template = handlebars.compile(html);
        var replacements = {
          code: vCode,
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
          from: '"MedConnect Admin" <medconnect.head@gmail.com>',
          to: email,
          subject: "MedConnect Account Verification",
          html: htmlToSend,
        };
        transporter.sendMail(mailOptions, function (error, response) {
          if (error) {
            console.log(error);
            callback(error);
          }
        });
      });

      /* transporter.sendMail(
        {
          from: '"MedConnect Admin" <medconnect.head@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "MedConnect Account Verification", // Subject line
          html: `<h3>Please verify your account!</h3>
            <br/>
            <p>Your Verification code is: ${vCode} </p>
            <br/><br/>
            <p>Verify your account here: <a href="medconnectdemo.herokuapp.com">link</a> </p>
            `, // html body
        },
        (err) => {
          if (err) console.log(err);
        }
      ); */

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
        {
          id: user.id,
          role: "admin",
          name: user.firstName + " " + user.lastName,
        },
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

router.post("/mobilelogin", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: { body: "All fields required" }, msgError: true });
    }

    //---------------------LOOK FOR USER IN PATIENTS COLLECTION-------------------//

    let user = await Patient.findOne({ email: email });

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
          expiresIn: "720h",
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

router.post("/sendMsg", (req, res) => {
  const { name, email, subject, message } = req.body;

  readHTMLFile(__dirname + "/emailcontact.html", function (err, html) {
    if (err) throw err;
    var template = handlebars.compile(html);
    var replacements = {
      name: name,
      email: email,
      subject: subject,
      msg: message,
    };
    var htmlToSend = template(replacements);
    var mailOptions = {
      from: '"MedConnect Admin" <medconnect.head@gmail.com>',
      to: "medconnect.head@gmail.com",
      subject: "Contact Us Message",
      html: htmlToSend,
    };
    transporter.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
        callback(error);
      }
    });
  });

  return res.status(200).json({
    msg: {
      body:
        "Message sent! Thank you for contacting us. We'll get back to you in a few days.",
    },
    msgError: false,
  });
});

module.exports = router;
