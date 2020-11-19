const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Types.ObjectId,
    ref: "patient",
    requrired: true,
  },
  office_id: { type: mongoose.Types.ObjectId, ref: "office", requrired: true },
  date: {
    month: String,
    day: String,
    year: String,
  },
  timeslot: String,
  dateObj: Date,
  createdOn: {
    type: Date,
  },
});

module.exports = Schedule = mongoose.model("schedule", ScheduleSchema);
