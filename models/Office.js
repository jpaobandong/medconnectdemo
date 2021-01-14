const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const OfficeSchema = new mongoose.Schema({
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
  specialization: {
    type: String,
    default: "",
  },
  contactNo: {
    type: String,
    default: "",
  },
  maxPatients: { type: Number, default: 0 },
  clinicDays: {
    type: [String],
    default: [],
  },
  clinicHours: {
    start: {
      type: String,
      default: "",
    },
    end: {
      type: String,
      default: "",
    },
  },
  address: {
    roomNumber: {
      type: String,
      required: true,
    },
    building: {
      type: String,
      required: true,
    },
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
    default: "office",
    setDefaultsOnInsert: true,
  },
});

OfficeSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 10, (err, passwordHash) => {
    if (err) return next(err);
    this.password = passwordHash;
    next();
  });
});

module.exports = Office = mongoose.model("office", OfficeSchema);
