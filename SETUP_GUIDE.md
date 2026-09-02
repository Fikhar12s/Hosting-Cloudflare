# Panduan Lengkap Instalasi & Integrasi Moemtaz CS AI Agent

Selamat datang! Dokumen ini dirancang khusus untuk memandu Anda menghubungkan Asisten AI ke akun Kommo CRM Anda, melakukan uji coba secara aman, hingga meluncurkannya agar dapat beroperasi 24 jam penuh. 

Panduan ini disusun secara bertahap agar mudah diikuti, bahkan jika Anda tidak memiliki latar belakang teknis (pemrograman).

---

## 1. Menghubungkan AI ke Akun Kommo Baru

Langkah pertama adalah memberikan AI "kunci rumah" agar ia bisa membaca pesan pelanggan dan mengirimkan balasan ke akun Kommo Anda.

### A. Membuat Kunci Akses (Long-Lived Token)
1. Buka *browser* (seperti Google Chrome) dan *login* ke akun Kommo Anda (contoh URL: `https://[namabisnis].kommo.com/`).
2. Pada menu di sebelah kiri layar, klik **Settings** (Pengaturan), lalu pilih opsi **Integrations** (Integrasi).
3. Di sudut kanan atas halaman tersebut, klik tombol **Create Integration**.
4. Pilih opsi **External Integration**.
5. Anda akan diminta mengisi sebuah formulir:
   - **Redirect URL:** Isi saja dengan `https://google.com` (ini sekadar formalitas).
   - **Scopes / Hak Akses:** Centang semua kotak akses yang tersedia agar AI dapat bekerja maksimal (pastikan mencakup: `CRM`, `Files`, `List external messages`, `Notifications`, dan `Send external messages`).
6. Klik **Save** untuk menyimpan.
7. Setelah tersimpan, klik menu tab bernama **Keys & Scopes**.
8. Cari bagian yang bernama **Long-Lived Token**, lalu klik tombol di sana untuk membuat kuncinya.
9. **Salin (Copy) kunci acak yang sangat panjang tersebut**. Simpan baik-baik di catatan rahasia Anda. Kita akan menggunakan kunci ini sebentar lagi.

### B. Mengetahui Nama Subdomain Anda
Lihat alamat *website* (URL) Kommo Anda saat ini. Jika alamatnya adalah `https://tokosaya.kommo.com`, maka nama subdomain Anda adalah **`tokosaya`**. Catat nama ini baik-baik.

---

## 2. Uji Coba Lokal (Mode Sandbox / Aman)

Sebelum mengaktifkan AI ke pelanggan sungguhan, kita akan melakukan uji coba secara tertutup menggunakan komputer Anda.

### A. Mengisi Kunci Rahasia
1. Buka folder proyek AI ini di komputer Anda. Cari file bernama `.dev.vars`. (File ini tersembunyi dan sangat rahasia).
2. Buka file tersebut menggunakan aplikasi *Notepad* atau pembuat teks lainnya, lalu sesuaikan isinya dengan kunci yang sudah Anda dapatkan tadi:
```env
# Kunci rahasia dari OpenAI (ChatGPT)
OPENAI_API_KEY="sk-proj-xxxxxx..."

# Pengaturan Kommo Anda
KOMMO_SUBDOMAIN="tokosaya"
KOMMO_LONG_LIVED_TOKEN="eyJ0eXAiOi..." (Tempelkan kunci panjang Anda di sini)

# Main Analysis Note
KOMMO_MAIN_ANALYSIS_NOTE_ENABLED="true"
TEST_LEAD_ID=""

# Debugging Control
ENABLE_DEBUG_JSON_NOTE="true"

# Pengaturan Ingatan AI (Biarkan angka ini jika ragu)
TAIL_MESSAGES="10"
MAX_SCAN_MESSAGES="100"
INCLUDE_ALL_CHATS_AFTER_SUMMARY="false"
```

### B. Menghidupkan Mesin AI di Komputer
Buka aplikasi *Terminal* atau *Command Prompt* di komputer Anda, arahkan ke folder proyek ini, dan ketik perintah berikut lalu tekan *Enter*:
```bash
npm run dev
```
Biarkan jendela hitam ini tetap terbuka. Ini menandakan mesin AI Anda sedang hidup di komputer.

### C. Membuka Jalur Komunikasi (Tunnel)
Agar Kommo (yang ada di internet) bisa berbicara dengan mesin AI (yang ada di komputer Anda), kita butuh sebuah "terowongan".
1. Buka jendela *Terminal/Command Prompt* yang **baru**.
2. Ketik perintah ini lalu tekan *Enter*:
```bash
cloudflared tunnel --url http://127.0.0.1:8787
```
3. Tunggu beberapa saat. Di layar akan muncul sebuah *link* atau alamat acak (contoh: `https://kucing-lucu-123.trycloudflare.com`). **Salin link tersebut.**

### D. Memasang "Telinga" AI (Webhook) di Kommo
1. Kembali ke aplikasi Kommo di *browser*,
2. Kembali masuk ke pengaturan integrasi
3. Klik tombol **Webhook** di sudut kanan atas.
5. Di kolom URL, tempelkan *link* acak dari langkah C tadi, dan wajib tambahkan tulisan `/kommo/incoming-message` tepat di ujungnya tanpa spasi.
   - Contoh akhir: `https://kucing-lucu-123.trycloudflare.com/kommo/incoming-message`
6. Klik **Save** (Simpan) dan tutup halaman pengaturan.
7. Selamat! Sekarang cobalah kirim pesan *chat* tiruan ke Kommo Anda. AI akan merespons!

---

## 3. Peluncuran Resmi (Mode Production)

Jika hasil uji coba sudah memuaskan, saatnya memindahkan AI ini ke *server* canggih bernama Cloudflare agar bisa hidup mandiri 24 jam nonstop (komputer Anda boleh dimatikan).

### A. Mengamankan Kunci Rahasia di Cloudflare
Buka jendela *Terminal* Anda, lalu ketik perintah ini satu per satu (tekan Enter setiap selesai satu baris, dan masukkan kunci rahasia Anda saat diminta):
```bash
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put KOMMO_LONG_LIVED_TOKEN
```

### B. Meluncurkan Aplikasi
Ketik perintah sakti ini untuk menerbangkan program AI Anda ke *server* global Cloudflare:
```bash
npm run deploy
```
Tunggu hingga proses instalasinya selesai (1-2 menit). Di akhir proses, Anda akan diberikan alamat URL permanen baru (contoh: `https://moemtaz-ai.namabisnis.workers.dev`).

### C. Mengubah Jalur Komunikasi Permanen
1. Buka kembali aplikasi Kommo > menu **Leads** > **Setup**.
2. Cari pengaturan *Webhook* yang Anda buat pada tahap 2D tadi.
3. Ganti URL acak yang lama dengan URL permanen baru yang baru saja Anda dapatkan dari Cloudflare.
   - Contoh akhir: `https://moemtaz-ai.namabisnis.workers.dev/kommo/incoming-message`
4. Klik **Save**. 

**Selesai!** Asisten AI Cerdas Anda sekarang sudah resmi diluncurkan dan siap melayani pelanggan bisnis Anda 24/7 tanpa henti.
