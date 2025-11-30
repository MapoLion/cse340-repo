  const accountModel = require("../models/account-model")
  const utilities = require("../utilities/")
  const bcrypt = require("bcryptjs")

  const jwt = require("jsonwebtoken")
  require("dotenv").config()

  /* ****************************************
  *  Deliver login view
  * *************************************** */
  async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
    })
  }

  /* ****************************************
  *  Deliver registration view
  * *************************************** */
  async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null
    })
  }

  /* ****************************************
  *  Deliver account management view
  * *************************************** */
  async function buildAccountManagement(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/account-management", {
      title: "Account Management",
      nav,
      errors: null
    })
  }

  /* ****************************************
  *  Process Registration
  * *************************************** */
  async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
    }
  }

  /* ****************************************
  *  Process login request
  * ************************************ */
  async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
      return
    }
    try {
      if (await bcrypt.compare(account_password, accountData.account_password)) {
        delete accountData.account_password
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        if(process.env.NODE_ENV === 'development') {
          res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
          res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }
        return res.redirect("/account/")
      }
      else {
        req.flash("message notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
          title: "Login",
          nav,
          errors: null,
          account_email,
        })
      }
    } catch (error) {
      throw new Error('Access Forbidden')
    }
  }

  /* ****************************************
  * Account Logout
  * ************************************ */
  async function accountLogout(req, res) {
    res.clearCookie("jwt")
    res.redirect("/")
  }


  /* ****************************************
  * Deliver account update view
  * ************************************ */
  async function buildAccountUpdate(req, res, next) {
    let nav = await utilities.getNav()
    const accountData =  await accountModel.getAccountById(res.locals.accountData.account_id);
    res.render("account/account-update", {
      title: "Account Update",
      nav,
      errors: null,
      accountData
    })
  }


  /* ****************************************
  * Process Account Update
  * ************************************ */

  async function updateAccount(req, res) {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email } = req.body;
    const account_id = res.locals.accountData.account_id;

    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    if (updateResult) {
      req.flash(
        "notice",
        `Congratulations, your account has successfully been updated.`
      )
      res.status(201).render("account/account-management", {
        title: "Account Management",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, account update failed.")
      res.status(501).render("account/account-update", {
        title: "Account Update",
        nav,
      })
    }
  }

  /* ****************************************
  * Process Password Update
  * ************************************ */

  async function updatePassword(req, res) {
    let nav = await utilities.getNav();
    const { account_password } = req.body;
    const account_id = res.locals.accountData.account_id;
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const updatePassResult = await accountModel.updatePassword(
      account_id,
      hashedPassword
      );
    if (updatePassResult) {
      req.flash(
        "notice",
        `Congratulations, your password has been successfully updated.`
      )
      res.status(201).render("account/account-management", {
        title: "Account Management",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, password update failed.")
      res.status(501).render("account/account-update", {
        title: "Account Update",
        nav,
      })
    }
  }


  module.exports = { 
    buildLogin, 
    buildRegister, 
    registerAccount, 
    accountLogin,
    buildAccountManagement,
    accountLogout,
    buildAccountUpdate,
    updateAccount,
    updatePassword
  }