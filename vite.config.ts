import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import type {SentryReactRouterBuildOptions} from "@sentry/react-router";
import { sentryReactRouter } from "@sentry/react-router";

const sentryConfig: SentryReactRouterBuildOptions = {
  org: "infy-org",
  project: "travel-agnecy",
  // An auth token is required for uploading source maps.
  authToken: "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"
  // ...
};


export default defineConfig(config => {
  return {
    plugins: [tailwindcss(),tsconfigPaths(),reactRouter(),sentryReactRouter(sentryConfig, config)],
    sentryConfig,
    ssr: {
      noExternal: [/@syncfusion/]
    }
  };
});
