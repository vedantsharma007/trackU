const { body } = require("express-validator");

exports.createTaskValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),

  body("recurring")
    .optional()
    .isIn(["none", "daily", "weekly", "monthly"])
    .withMessage("Invalid recurring value"),
];

exports.updateTaskValidator = [
  body("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),

  body("recurring")
    .optional()
    .isIn(["none", "daily", "weekly", "monthly"])
    .withMessage("Invalid recurring value"),

  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be true or false")
];
