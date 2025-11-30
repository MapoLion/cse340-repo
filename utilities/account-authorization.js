const jwt = require("jsonwebtoken")
const privileges = {}

privileges.checkAccountType = (req, res, next) => {
  const token = req.cookies.jwt
  if (!token) {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }

  try {
    const authorized = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    // Logged in as Employee Admin
    if (authorized.account_type === "Employee" || authorized.account_type === "Admin") {
      res.locals.accountData = authorized
      return next()
    }

    // Logged in as client
    req.flash("notice", "You are not authorized to view this page.")
    return res.redirect("/account/login")
   
    // Login error
  } catch (err) {
    req.flash("notice", "Log in failed. Please try again.")
    res.clearCookie("jwt")
    return res.redirect("/account/login")
  }
}

module.exports = privileges