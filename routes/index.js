const express = require("express");
const router = express.Router();
const participantsRoute = require("./participants");
const scannerRoute = require("./scan");
const sessionRoute = require("./sessions");

router.use("/participants", participantsRoute);
router.use("/scanner", scannerRoute);
router.use("/sesi", sessionRoute);

router.get("/status", (req, res) => {
  res.json({
    status: "ok",
  });
});

module.exports = router;
