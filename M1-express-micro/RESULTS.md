# M1 Express Micro — otex Benchmark Results

## Run Summary

| Metric | Value |
|--------|-------|
| **Tool** | otex (VS Code extension) |
| **Time** | 2m 40s (160s) |
| **Tokens** | 6k (excluding cache) |
| **Cost** | $0.002 |
| **Build check** | PASS |
| **Runtime check** | PASS — all 5 endpoints respond correctly |
| **Follow-up prompts** | 0 |
| **Files created** | 1 (`src/tracing.js`) |
| **Files modified** | 2 (`src/index.js`, `package.json`) |
| **Lines changed in index.js** | 1 (added `require("./tracing")`) |
| **Packages added** | 5 |

## Approach

otex chose **auto-instrumentation** via `@opentelemetry/auto-instrumentations-node`:

- Created `src/tracing.js` with `NodeSDK` setup, OTLP HTTP exporter, and auto-instrumentations
- Only added `require("./tracing")` at the top of `index.js` — application code untouched
- Disabled `@opentelemetry/instrumentation-fs` to reduce noise
- Used OTLP HTTP exporter (`localhost:4318`) instead of gRPC
- Configured `OTEL_EXPORTER_OTLP_ENDPOINT` env var fallback

### Packages Added
- `@opentelemetry/sdk-node`
- `@opentelemetry/auto-instrumentations-node`
- `@opentelemetry/exporter-trace-otlp-http`
- `@opentelemetry/resources`
- `@opentelemetry/semantic-conventions`

## Quality Rubric (1-5)

| Criterion | Score | Notes |
|-----------|-------|-------|
| Span naming (semantic conventions) | 5/5 | Auto-instrumentation uses correct HTTP semantic conventions |
| Context propagation | 5/5 | Auto-instrumentation handles `traceparent` headers automatically |
| Error recording | 4/5 | Auto-instrumentation records HTTP errors; no custom error spans on error handler |
| Resource attributes | 4/5 | `service.name` set; no `service.version` |
| SDK setup completeness | 5/5 | Exporter + resource + auto-instrumentations + graceful shutdown |
| **Average** | **4.6/5** | |

## Comparison vs Claude Code

| Metric | otex | Claude Code |
|--------|------|-------------|
| **Time** | 2m 40s | 4m 03s |
| **Tokens** | 6k | ~15k |
| **Cost** | $0.002 | ~$1.20 |
| **Follow-ups** | 0 | 1 |
| **Approach** | Auto-instrumentation | Manual spans |
| **index.js invasiveness** | 1 line | ~120 lines |
| **Quality avg** | 4.6/5 | 4.2/5 |
