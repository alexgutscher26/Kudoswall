import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { Resource } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const sdk = new NodeSDK({
      resource: new Resource({
        [ATTR_SERVICE_NAME]: "my-better-t-app-web",
      }),
      traceExporter: new OTLPTraceExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4318/v1/traces",
      }),
      instrumentations: [new HttpInstrumentation(), new FetchInstrumentation()],
    });
    sdk.start();

    process.on("SIGTERM", () => {
      sdk
        .shutdown()
        .then(() => console.log("Tracing SDK terminated"))
        .catch((error) => console.log("Error terminating tracing SDK", error))
        .finally(() => process.exit(0));
    });
  }
}
