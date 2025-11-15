const express = require("express")
const router = express.Router();

const baseController = require("../controllers/baseController");

// Index route
router.get("/", baseController.buildHome)

module.exports = router;