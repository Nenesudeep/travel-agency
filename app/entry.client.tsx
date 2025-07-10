import * as Sentry from "@sentry/react-router";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

Sentry.init({
    dsn: "https://6de31f5995cddbc7b9edf2fc511dbefc@o4509321026469888.ingest.de.sentry.io/4509321030074448",
    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0.1,
    // If the entire session is not sampled, use the below sample rate to sample
    // sessions when an error occurs.
    replaysOnErrorSampleRate: 1.0,
    integrations: [
        Sentry.replayIntegration({
            // Additional SDK configuration goes in here, for example:
            maskAllText: true,
            blockAllMedia: true,
        }),
    ],
    // Enable tracing
    tracesSampleRate: 1.0,
    // Session replay configuration
});

startTransition(() => {
    hydrateRoot(
        document,
        <StrictMode>
            <HydratedRouter />
        </StrictMode>
    );
});
