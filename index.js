// server.js
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
//Configure dotenv
require("dotenv").config();
// Connect to mongoDB
require("./db/db")();

const PORT = 5000 || process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Define the task schema and model using mongoose
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  todoStatus: String,
});

const Task = mongoose.model("Task", taskSchema);

app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/tasks", async (req, res) => {
  const { title, description, todoStatus } = req.body;

  try {
    const newTask = await Task.create({ title, description, todoStatus });
    res.json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  const { title, description, todoStatus } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, description, todoStatus },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
//delete a todo
app.delete("/api/tasks/:id", async (req, res) => {
  const taskId = req.params.id;

  try {
    await Task.findByIdAndRemove(taskId);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//deleted todo which is completed
app.delete("/api/completed", async (req, res) => {
  try {
    const deletedTasks = await Task.deleteMany({ todoStatus: "Completed" });

    res.json({
      message: `${deletedTasks.deletedCount} tasks deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//update all todo completed

app.put("/api/mark-completed", async (req, res) => {
  try {
    const updatedTasks = await Task.updateMany(
      {},
      { $set: { todoStatus: "Completed" } }
    );

    res.json(updatedTasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
