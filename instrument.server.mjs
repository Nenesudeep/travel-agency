import * as Sentry from "@sentry/react-router";

Sentry.init({
    dsn: "https://6de31f5995cddbc7b9edf2fc511dbefc@o4509321026469888.ingest.de.sentry.io/4509321030074448",

    // Adds request headers and IP for users, for more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
    sendDefaultPii: true,
});
