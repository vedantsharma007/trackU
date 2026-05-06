const { body } = require("express-validator");

exports.createTaskValidator = [
  body("title")
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 2 }).withMessage("Title must be at least 2 characters")
    .trim(),
  body("description")
    .optional({ nullable: true })
    .isString().withMessage("Description must be a string")
    .trim(),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"]).withMessage("Priority must be low, medium, or high"),
  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"]).withMessage("Invalid status"),
  body("recurring")
    .optional()
    .isIn(["none", "daily", "weekly", "monthly"]).withMessage("Invalid recurring value"),
  body("dueDate")
    .optional({ nullable: true })
    .isISO8601().withMessage("Invalid date format"),
  body("completedAt")
    .optional({ nullable: true })
    .isISO8601().withMessage("Invalid date format"),
];

exports.updateTaskValidator = [
  body("title")
    .optional()
    .isLength({ min: 2 }).withMessage("Title must be at least 2 characters")
    .trim(),
  body("description")
    .optional({ nullable: true })
    .isString().withMessage("Description must be a string")
    .trim(),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"]).withMessage("Priority must be low, medium, or high"),
  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"]).withMessage("Invalid status"),
  body("recurring")
    .optional()
    .isIn(["none", "daily", "weekly", "monthly"]).withMessage("Invalid recurring value"),
  body("dueDate")
    .optional({ nullable: true })
    .isISO8601().withMessage("Invalid date format"),
  body("completedAt")
    .optional({ nullable: true })
    .isISO8601().withMessage("Invalid date format"),
  body("completed")
    .optional()
    .isBoolean().withMessage("completed must be a boolean"),
];