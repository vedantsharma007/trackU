require("dotenv").config();
const connectDB = require("./config/db");
connectDB();

const Task = require("./models/Task");

const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is working");
});

app.post("/add-task", async (req, res) => {
    try {
        const { title, description } = req.body;

        const newTask = new Task({
            title,
            description
        });

        await newTask.save();

        res.json({
            message: "Task saved to DB",
            task: newTask
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
