// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")
const accountAuthorize = require ("../utilities/account-authorization")


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to get vehicle details view
router.get("/detail/:inv_id", invController.buildByInventoryId);

// Inventory Management View Route
router.get("/", 
  accountAuthorize.checkAccountType,
  utilities.handleErrors(invController.buildManagementView));

// Add Classification
router.get("/add-classification", 
  accountAuthorize.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification))

router.post(
  "/add-classification",
  accountAuthorize.checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkClassData,
  utilities.handleErrors(invController.addClassification))

// Add Inventory
router.get("/add-inventory",   
  accountAuthorize.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory))

router.post("/add-inventory", 
  accountAuthorize.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory))

router.get("/getInventory/:classification_id", 
  accountAuthorize.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON))

  
// Update Inventory
router.get("/edit/:inv_id",
  accountAuthorize.checkAccountType,
  utilities.handleErrors(invController.buildEditInventory)
)
router.post("/update/", 
  accountAuthorize.checkAccountType,
  invController.editInventory)


// Delete Inventory
router.get("/delete/:inv_id",
  accountAuthorize.checkAccountType,
  utilities.handleErrors(invController.buildDeleteInventory)
)

router.post("/delete",utilities.handleErrors(
  accountAuthorize.checkAccountType,
  invController.deleteInventory))

//Checkout
router.get(
  "/checkout/:inv_id",
  utilities.checkLogin, 
  invController.buildCheckout
)

//Confirm Purchase
router.post("/purchase", 
  utilities.checkLogin, 
  utilities.handleErrors(invController.purchaseVehicle))

module.exports = router
