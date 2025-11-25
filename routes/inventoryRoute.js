// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to get vehicle details view
router.get("/detail/:inv_id", invController.buildByInventoryId);

// Management View Route
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Add Classification
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassData,
  utilities.handleErrors(invController.addClassification))

// Add Inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))
router.post("/add-inventory", 
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory))

router.get("/getInventory/:classification_id", 
  //utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON))

router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventory)
)

router.post("/update/", invController.updateInventory)



module.exports = router
