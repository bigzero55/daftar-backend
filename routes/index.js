const express = require("express");
const router = express.Router();
const participantsRoute = require("./participants");
const scannerRoute = require("./scan");
const sessionRoute = require("./sessions");
const validatorRoute = require("./validators");

router.use("/participants", participantsRoute);
router.use("/scanner", scannerRoute);
router.use("/sesi", sessionRoute);
router.use("/validators", validatorRoute);

router.get("/status", (req, res) => {
  res.json({
    status: "ok",
  });
});

module.exports = router;
