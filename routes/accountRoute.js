const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

//Gets Login View
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//Gets Registration View
router.get("/register", utilities.handleErrors(accountController.buildRegister));

//Gets Account Management View
router.get("/",
  utilities.handleErrors(accountController.buildAccountManagement));

//Gets Account Update View
router.get("/update", 
  utilities.handleErrors(accountController.buildAccountUpdate));

//Initiate Log Out
router.get("/logout", accountController.accountLogout)

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
//router.post(
//  "/login",
//  (req, res) => {
///   res.status(200).send('login process')
//  }
//)

//Processes Log in
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Update Account Info  
router.post(
  "/update",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount)
)

// Update Account Password
router.post(
  "/update-password",
  regValidate.passwordUpdateRules(),
  regValidate.checkPasswordUpdateData,
  utilities.handleErrors(accountController.updatePassword)
)

module.exports = router;