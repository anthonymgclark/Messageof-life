import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  // Fix Keystatic OAuth URL on Vercel — the serverless function receives
  // a relative URL so Keystatic falls back to 'https://localhost' as the origin.
  // We reconstruct the request with the correct absolute URL from x-forwarded-host.
  if (context.url.pathname.startsWith("/api/keystatic")) {
    const forwardedHost = context.request.headers.get("x-forwarded-host");
    const forwardedProto =
      context.request.headers.get("x-forwarded-proto") ?? "https";

    if (forwardedHost && context.url.hostname === "localhost") {
      const correctedUrl = new URL(
        context.url.pathname + context.url.search,
        `${forwardedProto}://${forwardedHost}`
      );

      const correctedRequest = new Request(correctedUrl.toString(), {
        method: context.request.method,
        headers: context.request.headers,
        body: context.request.body,
        redirect: context.request.redirect as RequestRedirect,
      });

      // Replace the request in context
      Object.defineProperty(context, "request", {
        value: correctedRequest,
        writable: true,
        configurable: true,
      });
    }
  }

  return next();
});
