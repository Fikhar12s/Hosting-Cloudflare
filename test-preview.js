// test-preview.js
import { primaryGenerate } from './generate_ai_backup/primary_generate/primary_generate.js';

const mockCtx = {
  convKey: "lead:1860696",
  summary: "* Tanya brand/merek • Tertarik biaya/budget • Pesan terbaru: Woi • Pesan terbaru: Woi",
  tail: "Customer: Kenapa saya pesen nasi goreng ga datang ya\nCustomer: Saya pesen buat brand gmn detailnya\nCustomer: mau pesen brand dong kak\nCustomer: Halo\nCustomer: Selamat sore\nCustomer: Ada yang bisa jelasin?\nCustomer: kemarin datang kok gaada ya?\nCustomer: Kemarin datang ke kantor gaada orang, gimana ya?\nCustomer: Kak mau nanya boleh?\nCustomer: Woi",
  latestCustomerText: "Woi"
};

const mockEnv = {
  OPENAI_API_KEY: "mock_key_for_testing",
  OPENAI_MODEL: "gpt-5-nano"
};

// Mock fetch response for dry-run output
globalThis.fetch = async () => {
  return {
    ok: true,
    status: 200,
    json: async () => ({
      status: "completed",
      id: "resp_12345",
      output: [
        {
          type: "message",
          content: [
            {
              type: "text",
              text: JSON.stringify({
                intent: "exploration",
                emotion: "curiosity",
                behaviour_stage: "curiosity",
                lead_level_stage: "cold",
                conversion_rate_analyzed: 30,
                cs_action: "Tanyakan kebutuhan utama customer lalu arahkan ke alur order/maklon yang relevan.",
                suggested_response: "hai kak boleh jelaskan rencana brandnya dulu misalnya konsep target pasar budget MOQ dan timeline produksi supaya kami bisa kasih rekomendasi paket maklon yang pas",
                confidence_score: 70
              })
            }
          ]
        }
      ]
    })
  };
};

console.log("=== [1] UJI COBA SAKLAR DEBUG = TRUE ===");
const envTrue = { ...mockEnv, DEBUG_OPENAI_REPLY: true };
await primaryGenerate(envTrue, mockCtx);

console.log("\n=== [2] UJI COBA SAKLAR DEBUG = FALSE ===");
const envFalse = { ...mockEnv, DEBUG_OPENAI_REPLY: false };
await primaryGenerate(envFalse, mockCtx);
console.log("(Log debug OpenAI berhasil di-hide / disembunyikan!)");
