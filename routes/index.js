const express = require("express")
const router = express.Router();

const baseController = require("../controllers/baseController");

// Index route
router.get("/", baseController.buildHome)

//router.get("/", function(req, res){
//    res.render("index", {title: "Home"})
//})

module.exports = router;