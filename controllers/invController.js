const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build single vehicle detail view
 * ************************** */

invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getCarByInventoryId(inv_id)
  const details = await utilities.buildVehicleDetails(data)
  let nav = await utilities.getNav()
  const carYear = data.inv_year
  const carMake = data.inv_make
  const carModel = data.inv_model
  res.render("./inventory/details", {
    title: carYear + ' ' + carMake + ' ' + carModel,
    nav,
    details,
  })
}

  module.exports = invCont