const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

const  protect  = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validationMiddleware");

const {
  createTaskValidator,
  updateTaskValidator
} = require("../validators/taskValidator");

// CREATE
router.post("/", protect, createTaskValidator, validate, createTask);

// GET
router.get("/", protect, getTasks);
router.get("/:id", protect, getTaskById);

// UPDATE
router.put("/:id", protect, updateTaskValidator, validate, updateTask);

// DELETE
router.delete("/:id", protect, deleteTask);

module.exports = router;

