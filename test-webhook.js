// test-webhook.js
// Simulasi pengiriman webhook Slash Command /reply ke local Cloudflare Worker

const leadIds = {
  1: 1860696,
  2: 1860294,
  3: 2870162
};

const choice = process.argv[2] || '1';
const leadId = leadIds[choice] || leadIds[1];

const payload = {
  message: {
    add: [
      {
        text: "/reply",
        entity_id: leadId,
        entity_type: "lead"
      }
    ]
  }
};

console.log(`[TEST RUNNER] Mengirim simulasi webhook /reply untuk Lead ID: ${leadId}...`);

try {
  const response = await fetch('http://127.0.0.1:8787/kommo/incoming-message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  const text = await response.text();
  console.log('\n--- Webhook Response ---');
  console.log(`Status: ${response.status} ${response.statusText}`);
  console.log(`Response: ${text}`);
  console.log('\nLihat log pada jendela terminal yang menjalankan "npm run dev" untuk melihat detail analisis AI.');
} catch (err) {
  console.error('\nGagal terhubung ke local worker:', err.message);
  console.log('Pastikan local worker sudah dijalankan terlebih dahulu dengan perintah: npm run dev');
}
