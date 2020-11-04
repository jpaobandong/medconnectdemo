const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin",
    setDefaultsOnInsert: true,
  },
});

AdminSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = Admin = mongoose.model("admin", AdminSchema);
