const faker = require("faker");
const Office = require("./models/Office");
const Patient = require("./models/Patient");

const specializations = [
  "Immunology",
  "Anesthesiology",
  "Cardiology",
  "Pediatrics",
  "Internal Medicine",
  "Nephrology",
  "Nuclear Medicine",
  "Psychiatry",
  "Urology",
  "Hematology",
];

const createPatient = () => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: "patient",
    isVerified: true,
    createdAt: new Date(),
  };
};

const createPatients = (numPatients = 1) => {
  var patient;
  for (let index = 0; index < numPatients; index++) {
    patient = new Patient(createPatient());
    patient.save((err) => {
      if (err) console.log(err);
    });
  }
  console.log("Populated DB");
};

const createDoctor = () => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: "doctor",
    contactNo: faker.phone.phoneNumber(),
    specialization:
      specializations[Math.floor(Math.random() * specializations.length)],
    clinicDays: ["Monday", "Tuesday", "Thursday"],
    clinicHours: {
      start: "10:30 AM",
      end: "01:00 PM",
    },
    address: {
      roomNumber: Math.floor(Math.random() * Math.floor(500)),
      building: "Main Building",
      street: "100 Arellano street",
      city: "Dagupan City",
      province: "Pangasinan",
    },
  };
};

const createDoctors = (numUsers = 50) => {
  var office;
  for (let index = 0; index < numUsers; index++) {
    office = new Office(createDoctor());
    office.save();
  }
  console.log("Populated DB");
};

module.exports = { createDoctors, createPatients };
