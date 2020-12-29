const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schedule = require("./Schedule");
const Record = require("./Record");

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
  contactNo: {
    type: String,
    default: "",
  },
  details: {
    birthdate: {
      month: { type: String, default: "" },
      day: { type: String, default: "" },
      year: { type: String, default: "" },
    },
    sex: {
      type: String,
      default: "",
    },
    address: {
      street: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
      province: {
        type: String,
        default: "",
      },
    },
    philhealthNo: {
      type: String,
      default: "",
    },
    pwdNo: {
      type: String,
      default: "",
    },
    seniorNo: {
      type: String,
      default: "",
    },
  },
  medHist: {
    drugallergies: {
      type: String,
      default: "",
    },
    medications: {
      type: String,
      default: "",
    },
    otherillness: {
      type: String,
      default: "",
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

PatientSchema.pre("remove", function (next) {
  Schedule.remove({ patient_id: this._id }).exec();
  Record.remove({ patient_id: this._id }).exec();
  next();
});

PatientSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = Patient = mongoose.model("patient", PatientSchema);
