import { registerHooks } from "node:module";

/**
 * The built worker imports `cloudflare:workers`, which only exists inside the
 * Workers runtime. Stub it with an empty `env` so the tests exercise the site's
 * no-bindings path — exactly what visitors get before D1 and R2 are provisioned.
 */
const STUB = "cloudflare-stub:workers";

registerHooks({
  resolve(specifier, context, next) {
    if (specifier === "cloudflare:workers") return { url: STUB, shortCircuit: true };
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url === STUB) {
      return { format: "module", source: "export const env = {};", shortCircuit: true };
    }
    return next(url, context);
  },
});
