import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  // Fix Keystatic OAuth URL on Vercel.
  // Astro's adapter corrects context.url via x-forwarded-host, but
  // context.request.url (what Keystatic reads directly) stays as
  // https://localhost/... from the internal Vercel network.
  // We always reconstruct the request URL from x-forwarded-host when present.
  if (context.url.pathname.startsWith("/api/keystatic")) {
    const forwardedHost = context.request.headers.get("x-forwarded-host");
    const forwardedProto =
      context.request.headers.get("x-forwarded-proto") ?? "https";
    const requestHost = new URL(context.request.url).hostname;

    if (forwardedHost && requestHost !== forwardedHost) {
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

      Object.defineProperty(context, "request", {
        value: correctedRequest,
        writable: true,
        configurable: true,
      });
    }
  }

  return next();
});
