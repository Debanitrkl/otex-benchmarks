require("./tracing");

const express = require("express");
const { trace, SpanStatusCode } = require("@opentelemetry/api");

const app = express();
const PORT = process.env.PORT || 3000;
const tracer = trace.getTracer("m1-express-tasks");

app.use(express.json());

// In-memory store
const tasks = new Map();
let nextId = 1;

// GET /tasks - List all tasks
app.get("/tasks", (req, res) => {
  const span = tracer.startSpan("GET /tasks", {
    attributes: { "http.method": "GET", "http.route": "/tasks" },
  });
  try {
    const allTasks = Array.from(tasks.values());
    span.setAttribute("tasks.count", allTasks.length);
    res.json(allTasks);
  } catch (err) {
    span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
    span.recordException(err);
    throw err;
  } finally {
    span.end();
  }
});

// POST /tasks - Create a task
app.post("/tasks", (req, res) => {
  const span = tracer.startSpan("POST /tasks", {
    attributes: { "http.method": "POST", "http.route": "/tasks" },
  });
  try {
    const { title, description } = req.body;

    if (!title) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: "Title is required" });
      span.end();
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
    span.setAttribute("task.id", task.id);
    res.status(201).json(task);
  } catch (err) {
    span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
    span.recordException(err);
    throw err;
  } finally {
    span.end();
  }
});

// GET /tasks/:id - Get a single task
app.get("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const span = tracer.startSpan("GET /tasks/:id", {
    attributes: { "http.method": "GET", "http.route": "/tasks/:id", "task.id": id },
  });
  try {
    const task = tasks.get(id);

    if (!task) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: "Task not found" });
      span.end();
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
    span.recordException(err);
    throw err;
  } finally {
    span.end();
  }
});

// PUT /tasks/:id - Update a task
app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const span = tracer.startSpan("PUT /tasks/:id", {
    attributes: { "http.method": "PUT", "http.route": "/tasks/:id", "task.id": id },
  });
  try {
    const existing = tasks.get(id);

    if (!existing) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: "Task not found" });
      span.end();
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
  } catch (err) {
    span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
    span.recordException(err);
    throw err;
  } finally {
    span.end();
  }
});

// DELETE /tasks/:id - Delete a task
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const span = tracer.startSpan("DELETE /tasks/:id", {
    attributes: { "http.method": "DELETE", "http.route": "/tasks/:id", "task.id": id },
  });
  try {
    if (!tasks.has(id)) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: "Task not found" });
      span.end();
      return res.status(404).json({ error: "Task not found" });
    }

    tasks.delete(id);
    res.status(204).end();
  } catch (err) {
    span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
    span.recordException(err);
    throw err;
  } finally {
    span.end();
  }
});

// Error handler
app.use((err, req, res, next) => {
  const span = tracer.startSpan("error-handler", {
    attributes: { "error.message": err.message },
  });
  span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
  span.recordException(err);
  span.end();

  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Task API running on http://localhost:${PORT}`);
});
