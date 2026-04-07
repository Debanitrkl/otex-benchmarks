const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory store
const tasks = new Map();
let nextId = 1;

// GET /tasks - List all tasks
app.get("/tasks", (req, res) => {
  const allTasks = Array.from(tasks.values());
  res.json(allTasks);
});

// POST /tasks - Create a task
app.post("/tasks", (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const task = {
    id: nextId++,
    title,
    description: description || "",
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.set(task.id, task);
  res.status(201).json(task);
});

// GET /tasks/:id - Get a single task
app.get("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.get(id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json(task);
});

// PUT /tasks/:id - Update a task
app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = tasks.get(id);

  if (!existing) {
    return res.status(404).json({ error: "Task not found" });
  }

  const updated = {
    ...existing,
    title: req.body.title ?? existing.title,
    description: req.body.description ?? existing.description,
    completed: req.body.completed ?? existing.completed,
  };

  tasks.set(id, updated);
  res.json(updated);
});

// DELETE /tasks/:id - Delete a task
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (!tasks.has(id)) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.delete(id);
  res.status(204).end();
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Task API running on http://localhost:${PORT}`);
});
