const { NodeSDK } = require("@opentelemetry/sdk-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-grpc");
const { resourceFromAttributes } = require("@opentelemetry/resources");
const { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } = require("@opentelemetry/semantic-conventions");
const { SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-node");

const exporter = new OTLPTraceExporter({
  url: "http://localhost:4317",
});

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "m1-express-tasks",
    [ATTR_SERVICE_VERSION]: "1.0.0",
  }),
  spanProcessor: new SimpleSpanProcessor(exporter),
});

sdk.start();

process.on("SIGTERM", () => {
  sdk.shutdown().then(() => process.exit(0));
});
