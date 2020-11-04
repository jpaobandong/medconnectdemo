const mongoose = require("mongoose");

const VerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
  },
});

module.exports = Verification = mongoose.model(
  "verification",
  VerificationSchema
);
