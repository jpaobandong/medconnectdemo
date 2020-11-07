require("dotenv").config();
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");

  //check for token
  if (!token) {
    return res
      .status(401)
      .json({ msg: { body: "Unauthorized. No Token" }, msgError: true });
  }

  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //add user from payload
    if (!decoded)
      return res.status(401).json({
        msg: { body: "Unauthorized. Verification Failed" },
        msgError: true,
      });
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (err) {
    return res
      .status(400)
      .json({ msg: { body: "Token is invalid" }, msgError: true });
  }
}

function patient_auth(req, res, next) {
  const token = req.header("x-auth-token");

  //check for token
  if (!token) {
    return res
      .status(401)
      .json({ msg: { body: "Unauthorized. No Token" }, msgError: true });
  }

  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //add user from payload
    if (!decoded)
      return res.status(401).json({
        msg: { body: "Verification Failed" },
        msgError: true,
      });

    if (decoded.role !== "patient")
      return res.status(401).json({
        msg: { body: "Unauthorized." },
        msgError: true,
      });
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (err) {
    return res
      .status(400)
      .json({ msg: { body: "Token is invalid" }, msgError: true });
  }
}

function admin_auth(req, res, next) {
  const token = req.header("x-auth-token");

  //check for token
  if (!token) {
    return res
      .status(401)
      .json({ msg: { body: "Unauthorized. No Token" }, msgError: true });
  }

  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //add user from payload
    if (!decoded)
      return res.status(401).json({
        msg: { body: "Verification Failed" },
        msgError: true,
      });

    if (decoded.role !== "admin")
      return res.status(401).json({
        msg: { body: "Unauthorized." },
        msgError: true,
      });
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (err) {
    return res
      .status(400)
      .json({ msg: { body: "Token is invalid" }, msgError: true });
  }
}

function office_auth(req, res, next) {
  const token = req.header("x-auth-token");

  //check for token
  if (!token) {
    return res
      .status(401)
      .json({ msg: { body: "Unauthorized. No Token" }, msgError: true });
  }

  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //add user from payload
    if (!decoded)
      return res.status(401).json({
        msg: { body: "Verification Failed" },
        msgError: true,
      });

    if (decoded.role !== "office")
      return res.status(401).json({
        msg: { body: "Unauthorized." },
        msgError: true,
      });
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (err) {
    return res
      .status(400)
      .json({ msg: { body: "Token is invalid" }, msgError: true });
  }
}

module.exports = { auth, patient_auth, admin_auth, office_auth };
