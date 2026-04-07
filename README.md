# otex Benchmarks

Comparing [otex](https://github.com/parseablehq/otex) (specialized OTEL instrumentation VS Code extension) against general-purpose coding agents for automated OpenTelemetry instrumentation tasks.

## Tools Under Test

| Tool | Type | Description |
|------|------|-------------|
| **[otex](https://github.com/parseablehq/otex)** | Specialized | VS Code extension that auto-instruments codebases with OpenTelemetry using AST analysis + Claude Agent SDK |
| **[Claude Code](https://claude.ai/claude-code)** | General-purpose | Anthropic's CLI coding agent |
| **[Codex](https://github.com/openai/codex)** | General-purpose | OpenAI's CLI coding agent |

## Benchmarks

### M1: Express Micro (Single-file, ~80 LOC)

Simple Express REST API with 5 CRUD endpoints and an error handler. Zero OTEL instrumentation at baseline.

**Task**: Add OpenTelemetry distributed tracing with OTLP exporter, following semantic conventions.

#### Results

| Metric | otex | Claude Code | Codex |
|--------|------|-------------|-------|
| **Time** | 2m 40s | 4m 03s | _pending_ |
| **Tokens** | 6k | ~15k (est.) | _pending_ |
| **Cost** | $0.002 | ~$1.20 (est.) | _pending_ |
| **Build + Run** | PASS | PASS (1 fix) | _pending_ |
| **Follow-up prompts** | 0 | 1 | _pending_ |
| **Approach** | Auto-instrumentation | Manual spans | _pending_ |
| **index.js changes** | 1 line | ~120 lines | _pending_ |
| **Packages added** | 5 | 7 | _pending_ |

#### Key Observations

- **otex** used `@opentelemetry/auto-instrumentations-node` — only added `require("./tracing")` to `index.js`, keeping the application code untouched
- **Claude Code** wrapped every endpoint handler in manual `tracer.startSpan()` / `span.end()` blocks — more verbose but provides per-endpoint custom attributes
- **Claude Code** hit a breaking API change (`Resource` constructor removed in `@opentelemetry/resources` v2.x) and needed 1 fix iteration
- **otex was ~600x cheaper** ($0.002 vs ~$1.20) and 34% faster, with zero corrections needed

### S1: Fastify + Prisma (Multi-file, ~500 LOC)
_Coming soon_

### S3: Next.js App Router (Multi-file, ~500 LOC)
_Coming soon_

### S2: Actix-web + SQLx, Rust (Multi-file, ~500 LOC)
_Coming soon_

## Methodology

Each tool is given the same task on an identical clean codebase (no prior OTEL instrumentation). We measure:

| Dimension | How |
|-----------|-----|
| **Correctness** | Does `npm install` + `node src/index.js` succeed? |
| **Completeness** | % of endpoints instrumented |
| **Speed** | Wall-clock time from prompt to working instrumentation |
| **Token / Cost** | API tokens consumed (excluding cache), estimated USD |
| **Human Intervention** | Number of follow-up prompts or manual corrections |
| **Code Impact** | Lines changed, packages added |

### Standardized Prompt (for Claude Code & Codex)

> Add OpenTelemetry distributed tracing to this project. Instrument all HTTP endpoints, database calls, and critical async operations. Use the official OTEL SDK for JavaScript/Node.js. Set up the SDK with OTLP exporter to http://localhost:4317. Follow OTEL semantic conventions. Do not use auto-instrumentation packages — add manual spans.

otex uses its own built-in workflow (Analyze → Plan → Instrument) with no custom prompt.

## Repository Structure

```
otex-benchmarks/
├── README.md
├── BENCHMARK_PROMPT.md          # Standardized prompt for general-purpose agents
├── docker-compose.yml           # OTEL Collector + Jaeger for trace verification
├── otel-collector-config.yml
└── M1-express-micro/            # Benchmark M1: Express REST API
    ├── src/index.js
    ├── package.json
    └── test.sh                  # Smoke test script
```

### Branches

| Branch | Description |
|--------|-------------|
| `main` | Clean baseline (no instrumentation) |
| `m1/otex` | M1 instrumented by otex |
| `m1/claude-code` | M1 instrumented by Claude Code |
| `m1/codex` | M1 instrumented by Codex (_pending_) |

## Running Locally

```bash
# Start OTEL Collector + Jaeger
docker compose up -d

# Run the clean baseline
cd M1-express-micro && npm install && npm start

# Smoke test
./test.sh

# View traces at http://localhost:16686 (Jaeger UI)
```

## License

MIT
