const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const { validationResult } = require("express-validator")


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

/* ***************************
*  Build inventory management view
* ************************** */
invCont.buildManagementView = async function (req, res, next) {
const classificationSelect = await utilities.buildClassificationList()
let nav = await utilities.getNav();
 res.render("./inventory/management", {
   title: "Vehicle Management",
   nav,
   errors: null,
   classificationSelect
 });
};

/* ***************************
*  Build Add Classification view
* ************************** */

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
}

  /* ***************************
 *  Add Classification
 * ************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;

  let nav = await utilities.getNav();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors,
    });
  }

  const addResult = await invModel.addClassification(classification_name);

  if (addResult) {
    nav = await utilities.getNav();

    req.flash("notice", "New classification added.");
    return res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect: await utilities.buildClassificationList(),
    });
  } else {
    req.flash("notice", "New classification failed.");
    return res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  }
};

/* ***************************
*  Build Add Vehicles view
* ************************** */

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationSelect,
    errors: null
  })
}  

/* ***************************
*  Build Add a Vehicle
* ************************** */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  const result = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (result) {
    req.flash("notice", `${inv_make} ${inv_model} successfully added.`)
    return res.redirect("/inv")
  }

  const classificationSelect = await utilities.buildClassificationList(classification_id)
  req.flash("notice", "Failed to add vehicle.")
  res.status(400).render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationSelect,
    errors: null,
    ...req.body
  })
}


  module.exports = invCont