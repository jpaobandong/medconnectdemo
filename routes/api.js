const auth_routes = require("./auth");
const patient_routes = require("./patient_routes");
const admin_routes = require("./admin_routes");
const office_routes = require("./office_routes");
const router = require("express").Router();

router.use("/auth", auth_routes);
router.use("/patient", patient_routes);
router.use("/admin", admin_routes);
router.use("/office", office_routes);

module.exports = router;
