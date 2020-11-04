const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const PatientSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    default: "",
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
  },

  role: {
    type: String,
    default: "patient",
    setDefaultsOnInsert: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
    setDefaultsOnInsert: true,
  },
  createdAt: {
    type: Date,
  },
});

PatientSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 10, (err, passwordHash) => {
    if (err) return next(err);
    this.password = passwordHash;
    next();
  });
});

PatientSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = Patient = mongoose.model("patient", PatientSchema);
