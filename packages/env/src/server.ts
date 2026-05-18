/// <reference path="../env.d.ts" />
function getNodeEnvValue(key: string) {
  return process.env[key];
}

function getCloudflareEnvSync() {
  try {
    // In production, env vars are usually available on process.env via shims.
    // We only attempt to load the Cloudflare context if we're not in a standard Node environment.
    if (process.env.NEXT_RUNTIME === "edge") {
      // @ts-ignore - dynamic resolution to avoid bundler pulling in wrangler
      const { getCloudflareContext } = require("@opennextjs/cloudflare");
      return getCloudflareContext().env as Env;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

type EnvValue = Env[keyof Env];

function createEnvProxy(getValue: (key: keyof Env & string) => EnvValue | undefined) {
  return new Proxy({} as Env, {
    get(_target, prop) {
      if (typeof prop !== "string") {
        return undefined;
      }

      return getValue(prop as keyof Env & string);
    },
  });
}

function resolveEnvValue(key: keyof Env & string): EnvValue | undefined {
  const nodeValue = getNodeEnvValue(key);
  if (nodeValue !== undefined) {
    return nodeValue as EnvValue;
  }

  return getCloudflareEnvSync()?.[key as keyof Env];
}

// Next.js local dev runs in Node.js, where env vars are exposed on process.env.
// In the Cloudflare runtime, fall back to OpenNext's Cloudflare context bindings.
// For static routes (ISR/SSG), use getEnvAsync() so OpenNext can resolve bindings
// with the async Cloudflare context API.
export async function getEnvAsync() {
  let cloudflareEnv: Env = {} as Env;
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    cloudflareEnv = (await getCloudflareContext({ async: true })).env as Env;
  } catch {
    // Fallback to process.env if CF context fails
  }

  return createEnvProxy((key) => {
    const nodeValue = getNodeEnvValue(key);
    if (nodeValue !== undefined) {
      return nodeValue;
    }

    return cloudflareEnv[key as keyof Env];
  });
}

export const env = createEnvProxy(resolveEnvValue);
