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
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;

  // prevent abuse
  if (limit > 50) {
    return res.status(400).json({ message: "Limit too high (max 50)" });
  }

  const skip = (page - 1) * limit;

  // base filter (user-specific)
  let filter = { user: req.user._id };

  // filtering by completed status
  if (req.query.completed !== undefined) {
    if (req.query.completed === "true") {
      filter.completed = true;
    } else if (req.query.completed === "false") {
      filter.completed = false;
    } else {
      return res.status(400).json({ message: "Invalid completed value" });
    }
  }

  // search by title (optional advanced)
  if (req.query.search) {
    filter.title = { $regex: req.query.search, $options: "i" };
  }

  const tasks = await Task.find(filter)
    .sort({ createdAt: -1 }) // latest first
    .skip(skip)
    .limit(limit);

  const total = await Task.countDocuments(filter);

  res.status(200).json({
    success: true,
    total,
    page,
    pages: Math.ceil(total / limit),
    count: tasks.length,
    tasks
  });
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


