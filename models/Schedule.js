const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  patient_id: { type: mongoose.ObjectId, requrired: true },
  office_id: { type: mongoose.ObjectId, requrired: true },
  date: {
    month: String,
    day: String,
    year: String,
  },
  timeslot: String,

  createdOn: {
    type: Date,
  },
});

module.exports = Schedule = mongoose.model("schedule", ScheduleSchema);
