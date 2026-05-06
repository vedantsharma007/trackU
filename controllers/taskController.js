const Task = require("../models/Task");
const asyncHandler = require("../middleware/asyncHandler");


// CREATE TASK
exports.createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, status, recurring, dueDate } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  // Build task object — only include fields that are valid
  const taskData = {
    user:      req.user._id,
    title:     title.trim(),
    completed: false,
    status:    "pending",
  };

  // Only add optional fields if they have valid values
  if (description) taskData.description = description.trim();
  if (priority && ["low","medium","high"].includes(priority)) {
    taskData.priority = priority;
  }
  if (recurring && ["none","daily","weekly","monthly"].includes(recurring)) {
    taskData.recurring = recurring;
  }
  if (dueDate) taskData.dueDate = new Date(dueDate);

  const task = await Task.create(taskData);
  res.status(201).json(task);
});



// GET ALL TASKS
exports.getTasks = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;

  if (limit > 50) {
    return res.status(400).json({ message: "Limit too high (max 50)" });
  }

  const skip = (page - 1) * limit;

  // base filter
  let filter = { user: req.user._id };

  // filter by completed
  if (req.query.completed !== undefined) {
    if (req.query.completed === "true") {
      filter.completed = true;
    } else if (req.query.completed === "false") {
      filter.completed = false;
    } else {
      return res.status(400).json({ message: "Invalid completed value" });
    }
  }

  // 🔍 SEARCH (TEXT INDEX)
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  // 🎯 FIELD SELECTION
  let select = "-__v";
  if (req.query.fields) {
    select = req.query.fields.split(",").join(" ");
  }

  // 🔃 SORTING
  let sort = { createdAt: -1 };
  if (req.query.sort) {
    sort = {};
    const fields = req.query.sort.split(",");
    fields.forEach(field => {
      if (field.startsWith("-")) {
        sort[field.substring(1)] = -1;
      } else {
        sort[field] = 1;
      }
    });
  }

  const tasks = await Task.find(filter)
    .select(select)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

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


