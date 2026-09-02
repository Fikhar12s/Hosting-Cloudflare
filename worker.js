// worker.js

import {
  routeHttpRequest,
} from "./router/http_router.js";

import {
  logDeveloperPromptOnce,
} from "./generate_ai_backup/primary_generate/primary_generate.js";

import {
  handleCronScheduledWorkflow,
} from "./workflow/scheduled_workflow.js";

import {
  resetKvWriteState,
} from "./shared/kv_memory.js";

/* -----------------------------
   Cloudflare Worker entry point
------------------------------ */

export default {
  async fetch(request, env, ctx) {
    // Print Developer Prompt sekali saat server pertama kali menerima request
    logDeveloperPromptOnce(env);
    resetKvWriteState(env);

    try {
      return await routeHttpRequest(request, env, ctx);
    } catch (err) {
      console.error("worker.fetch error:", err?.stack || String(err));

      return Response.json(
        {
          ok: false,
          error: "internal_worker_error",
          message: "Unexpected worker error",
        },
        {
          status: 500,
        }
      );
    }
  },

  async scheduled(event, env, ctx) {
    resetKvWriteState(env);

    try {
      ctx.waitUntil(handleCronScheduledWorkflow(event, env));
    } catch (err) {
      console.error("worker.scheduled error:", err?.stack || String(err));
    }
  },
};
