const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Types.ObjectId,
    ref: "patient",
    requrired: true,
  },
  office_id: { type: mongoose.Types.ObjectId, ref: "office", requrired: true },
  schedule_id: {
    type: mongoose.Types.ObjectId,
    ref: "schedule",
    requrired: true,
  },
  age: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  height: {
    type: String,
    required: true,
  },
  bloodPressure: {
    type: String,
    required: true,
  },
  temperature: {
    type: String,
    required: true,
  },
  respiration: {
    type: String,
    required: true,
  },
  pulseRate: {
    type: String,
    required: true,
  },
  medicalHistory: {
    type: String,
    required: true,
  },
  symptoms: {
    type: String,
    required: true,
  },
  diagnosis: {
    type: String,
    required: true,
  },
  prescription: {
    type: String,
    required: true,
  },
});

module.exports = Record = mongoose.model("record", RecordSchema);
