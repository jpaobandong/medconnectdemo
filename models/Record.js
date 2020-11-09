const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
  patient_id: { type: mongoose.ObjectId, requrired: true },
  office_id: { type: mongoose.ObjectId, requrired: true },
  schedule_id: { type: mongoose.ObjectId, requrired: true },
  age: {
    type: String,
    required: true,
  },
  civStatus: {
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
  vitals: {
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
    heartRate: {
      type: String,
      required: true,
    },
  },
  medications: {
    type: String,
    required: true,
  },
  patientHistory: {
    type: String,
    required: true,
  },
  complaints: {
    type: String,
    required: true,
  },
});

module.exports = Record = mongoose.model("record", RecordSchema);
