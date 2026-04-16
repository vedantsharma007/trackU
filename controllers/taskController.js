const Task = require("../models/Task");
const asyncHandler = require("../middleware/asyncHandler");


// CREATE TASK
exports.createTask = asyncHandler(async (req, res) => {
  if (!req.body.title) {
    const error = new Error("Title is required");
    error.statusCode = 400;
    throw error;
  }

  const task = await Task.create({
    title: req.body.title,
    user: req.user._id
  });

  res.status(201).json(task);
});



// GET ALL TASKS
exports.getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });

  res.status(200).json(tasks);
});



// GET SINGLE TASK
exports.getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  if (task.user.toString() !== req.user._id.toString()) {
    const error = new Error("Not authorized");
    error.statusCode = 401;
    throw error;
  }

  res.status(200).json(task);
});

// UPDATE TASK
exports.updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  if (task.user.toString() !== req.user._id.toString()) {
    const error = new Error("Not authorized");
    error.statusCode = 401;
    throw error;
  }

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedTask);
});


// DELETE TASK
exports.deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  if (task.user.toString() !== req.user._id.toString()) {
    const error = new Error("Not authorized");
    error.statusCode = 401;
    throw error;
  }

  await task.deleteOne();

  res.status(200).json({ message: "Task deleted successfully" });
});


