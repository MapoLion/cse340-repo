const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}


/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isAlphanumeric()
      .withMessage("Classification name must be alphanumeric.")
      .isLength({ min: 1 })
      .withMessage("Classification name is required.")
  ];
};


/* ******************************
 * Check data and return errors or continue to classification
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors
    })
  }
  next()
}

/*  **********************************
  *  Inventory Validation Rules
  *********************************** */
validate.inventoryRules = () => {
  return [
    body("classification_id")
      .isInt({ min: 1 })
      .withMessage("Please select a classification."),

    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required."),

    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required."),

    body("inv_year")
      .trim()
      .notEmpty()
      .withMessage("Year is required."),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required. Do you want your customers to know nothing about this vehicle?"),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required. Even if it's just the placeholder one."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required. Even if it's just the placeholder one."),

    body("inv_price")
      .isFloat({ min: 1 })
      .withMessage("Price must be a number greater than 0. C'mon, we're not giving our cars out for free."),

    body("inv_miles")
      .isInt({ min: 0 })
      .notEmpty()
      .withMessage("Miles must have a number. Even if it's zero"),

    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required. What's a car without color?")
  ]
}

/* **************************************
 * Check Inventory Data (sticky form)
 *************************************** */
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(req.body.classification_id)

    return res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: errors.array(), 
      ...req.body               
    })
  }
  next()
}


module.exports = validate