# Standardized Prompt for Claude Code & Codex

Use this exact prompt when running the benchmark against each general-purpose agent:

---

> Add OpenTelemetry distributed tracing to this project. Instrument all HTTP endpoints, database calls, and critical async operations. Use the official OTEL SDK for JavaScript/Node.js. Set up the SDK with OTLP exporter to http://localhost:4317. Follow OTEL semantic conventions. Do not use auto-instrumentation packages — add manual spans.

---

## Evaluation Checklist

After each tool completes, verify:

- [ ] `npm install` succeeds
- [ ] `npm start` launches without errors
- [ ] Spans appear for each endpoint (GET /tasks, POST /tasks, GET /tasks/:id, PUT /tasks/:id, DELETE /tasks/:id)
- [ ] Error handler produces error spans
- [ ] Span names follow HTTP semantic conventions (e.g. `GET /tasks`)
- [ ] `service.name` resource attribute is set
- [ ] OTLP exporter configured for localhost:4317
- [ ] Context propagation headers handled (traceparent)
