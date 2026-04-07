# M1 Express Micro — Benchmark Results

## Claude Code Run

| Metric | Value | Notes |
|--------|-------|-------|
| **Time** | ~243s (~4 min) | Includes 1 fix iteration (Resource API change) |
| **Build check** | PASS | `npm install` + `node src/index.js` both succeed |
| **Runtime check** | PASS | All 5 endpoints return correct responses |
| **Follow-up prompts** | 1 | Resource constructor changed in OTEL SDK v2.x, required fix |
| **Files created** | 1 (`src/tracing.js`) | |
| **Files modified** | 2 (`src/index.js`, `package.json`) | |
| **Lines added** | ~120 | Manual span wrapping is verbose |
| **Packages added** | 7 | @opentelemetry/api, sdk-node, sdk-trace-node, exporter-trace-otlp-grpc, resources, semantic-conventions, instrumentation |

### Quality Rubric (1-5)

| Criterion | Score | Notes |
|-----------|-------|-------|
| Span naming (semantic conventions) | 4/5 | Uses `GET /tasks`, `POST /tasks` etc — correct but could use `http.method + http.route` format |
| Context propagation | 3/5 | No middleware-level propagation of incoming `traceparent` headers |
| Error recording | 5/5 | Every route has `setStatus(ERROR)` + `recordException()` |
| Resource attributes | 5/5 | `service.name` + `service.version` set correctly |
| SDK setup completeness | 4/5 | Exporter + resource configured; using SimpleSpanProcessor (BatchSpanProcessor better for prod) |
| **Average** | **4.2/5** | |

### Observations
- Required 1 code fix: `Resource` constructor was replaced by `resourceFromAttributes()` in `@opentelemetry/resources` v2.x
- Manual span instrumentation is verbose (~15 lines of boilerplate per endpoint)
- No auto-propagation of W3C trace context from incoming requests — would need express middleware
- Used SimpleSpanProcessor instead of BatchSpanProcessor (acceptable for demo, not ideal for prod)

---

## otex Run
_Pending — run otex on the `m1/otex` branch_

## Codex Run
_Pending — run OpenAI Codex CLI on the `m1/codex` branch_
