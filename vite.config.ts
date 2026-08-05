import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
import authFunction from "./api/auth";
import adminFunction from "./api/admin";
import bangLeaveFunction from "./api/bang-leave";

type WebHandler = (request: Request) => Promise<Response> | Response;

const LOCAL_API_ENV_KEYS = [
  "ADMIN_PASSWORD",
  "VITE_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "AUTH_PASSWORD_PEPPER",
] as const;

function figmaAssetResolver(): Plugin {
  return {
    name: "figma-asset-resolver",
    resolveId(id) {
      if (id.startsWith("figma:asset/")) {
        const filename = id.replace("figma:asset/", "");
        return path.resolve(__dirname, "src/assets", filename);
      }
    },
  };
}

async function readRequestBody(request: IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return chunks.length > 0 ? Buffer.concat(chunks) : undefined;
}

async function toWebRequest(request: IncomingMessage) {
  const host = request.headers.host ?? "localhost";
  const url = new URL(request.url ?? "/", `http://${host}`);
  const method = request.method ?? "GET";
  const body = method === "GET" || method === "HEAD"
    ? undefined
    : await readRequestBody(request);

  return new Request(url, {
    method,
    headers: request.headers as HeadersInit,
    body,
  });
}

async function sendWebResponse(response: Response, target: ServerResponse) {
  target.statusCode = response.status;
  response.headers.forEach((value, key) => target.setHeader(key, value));
  target.end(Buffer.from(await response.arrayBuffer()));
}

function localVercelApi(env: Record<string, string>): Plugin {
  const handlers: Record<string, WebHandler> = {
    "/api/auth": authFunction.fetch,
    "/api/admin": adminFunction.fetch,
    "/api/bang-leave": bangLeaveFunction.fetch,
  };

  LOCAL_API_ENV_KEYS.forEach((key) => {
    if (env[key]) process.env[key] = env[key];
  });

  return {
    name: "local-vercel-api",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(
          request.url ?? "/",
          `http://${request.headers.host ?? "localhost"}`,
        ).pathname;
        const handler = handlers[pathname];
        if (!handler) {
          next();
          return;
        }

        try {
          await sendWebResponse(await handler(await toWebRequest(request)), response);
        } catch (error) {
          console.error("Local API request failed.", error);
          response.statusCode = 500;
          response.end("Local API request failed");
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      figmaAssetResolver(),
      localVercelApi(env),
      // The React and Tailwind plugins are both required for Make.
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ["**/*.svg", "**/*.csv"],
  };
});
