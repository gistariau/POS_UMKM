================================================================================
PANDUAN INSTALASI & PENGUJIAN LENGKAP
POS – Aplikasi Kasir, Keuangan, dan Stok UMKM
Dikembangkan oleh PT. GISTARIAU GEOSPASIAL SOLUTION (https://gistariau.com/)
================================================================================

DAFTAR ISI:
A. Instalasi Backend (Google Spreadsheet & Google Apps Script)
B. Instalasi Frontend & API Proxy (Cloudflare Pages)
C. Login Pertama & Keamanan Akun Admin
D. Checklist Pengujian 20 Komponen Sistem
E. Pemecahan Masalah (Troubleshooting)

--------------------------------------------------------------------------------
A. INSTALASI BACKEND (GOOGLE APPS SCRIPT & GOOGLE SPREADSHEET)
--------------------------------------------------------------------------------
1. Buka Google Drive Anda (https://drive.google.com) menggunakan akun Google.
2. Klik tombol "+ Baru" (New) -> pilih "Google Spreadsheet" -> "Spreadsheet kosong".
   (Catatan: Anda juga bisa langsung membuka https://script.google.com, karena
   fungsi setupDatabase() akan otomatis membuat file Spreadsheet jika belum ada).
3. Di dalam Spreadsheet, klik menu atas: "Ekstensi" (Extensions) -> "Apps Script".
4. Hapus seluruh kode bawaan (function myFunction() {}) di dalam editor Code.gs.
5. Salin seluruh isi file `code.gs` yang telah disediakan, lalu tempelkan (Paste)
   ke editor Google Apps Script tersebut.
6. Klik ikon Disket (Simpan / Save) atau tekan Ctrl + S. Beri nama project,
   misalnya: "Backend POS UMKM".
7. Pada toolbar atas editor Apps Script, pilih dropdown fungsi di sebelah tombol
   "Jalankan" (Run), pilih fungsi: `setupDatabase`.
8. Klik tombol "Jalankan" (Run).
9. Pemberian Izin Akses Google (Authorization):
   - Akan muncul pop-up "Perlu otorisasi" (Authorization required). Klik "Tinjau Izin".
   - Pilih akun Google Anda.
   - Jika muncul peringatan "Google hasn't verified this app", klik "Advanced" (Lanjutan)
     di kiri bawah, lalu klik "Go to Backend POS UMKM (unsafe)".
   - Klik "Allow" (Izinkan).
10. Tunggu hingga log eksekusi menampilkan pesan:
    "Database berhasil diinisialisasi! Spreadsheet URL: https://docs.google.com/..."
11. Buka URL Spreadsheet tersebut (atau cek Google Drive Anda untuk file bernama
    `DB_POS_UMKM_GISTARIAU`) dan pastikan ke-15 sheet berikut sudah terbentuk:
    - CONFIG, USERS, PRODUCTS, CATEGORIES, CUSTOMERS, SUPPLIERS, TRANSACTIONS,
      TRANSACTION_ITEMS, STOCK_MOVEMENTS, PURCHASES, PURCHASE_ITEMS, INCOMES,
      EXPENSES, CASH_FLOW, AUDIT_LOGS.
12. Melakukan Deployment sebagai Web App:
    - Di kanan atas editor Apps Script, klik tombol biru "Terapkan" (Deploy) ->
      pilih "Deployment baru" (New deployment).
    - Klik ikon gerigi (Select type) -> pilih "Aplikasi web" (Web app).
    - Isi Deskripsi: "API POS UMKM v1".
    - Execute as (Jalankan sebagai): pilih "Me" (Saya / email Anda).
    - Who has access (Yang memiliki akses): WAJIB pilih "Anyone" (Siapa saja).
    - Klik "Terapkan" (Deploy).
13. Salin "URL aplikasi web" (Web app URL) yang berakhiran `/exec`.
    Simpan URL ini baik-baik untuk langkah berikutnya.

--------------------------------------------------------------------------------
B. INSTALASI FRONTEND & API PROXY (CLOUDFLARE PAGES)
--------------------------------------------------------------------------------
Struktur folder project Frontend Anda wajib disusun seperti berikut:

  pos-umkm/
  ├── index.html
  └── functions/
      └── api/
          └── [[path]].js

Langkah Deployment ke Cloudflare Pages:
1. Buat folder di komputer Anda bernama `pos-umkm`.
2. Letakkan file `index.html` di dalam folder utama `pos-umkm/`.
3. Buat subfolder `functions`, lalu di dalamnya buat subfolder `api`, dan letakkan
   file `[[path]].js` di dalamnya (`pos-umkm/functions/api/[[path]].js`).
4. Login ke Dashboard Cloudflare Anda (https://dash.cloudflare.com/).
5. Pada menu sebelah kiri, pilih "Workers & Pages" -> klik "Create" -> pilih tab
   "Pages" -> pilih "Upload assets" (atau hubungkan via GitHub/GitLab jika memakai Git).
6. Beri nama project, misalnya: `pos-umkm-kasir`, lalu klik "Create project".
7. Unggah seluruh isi folder `pos-umkm` (pastikan `index.html` dan folder `functions`
   ikut terunggah), lalu klik "Deploy site".
8. Mengatur Environment Variable `GAS_WEB_APP_URL`:
   - Setelah project dibuat, masuk ke menu "Settings" -> "Environment variables"
     (atau "Variables and Secrets") pada project Cloudflare Pages tersebut.
   - Klik "Add variable".
   - Variable name: `GAS_WEB_APP_URL`
   - Value: Tempelkan URL Web App Google Apps Script yang berakhiran `/exec`.
   - Simpan untuk Production (dan Preview jika diperlukan).
9. PENTING: Setelah menambahkan Environment Variable, lakukan "Retry deployment"
   atau unggah ulang aset pada tab "Deployments" agar Cloudflare Pages menerapkan
   variabel lingkungan tersebut ke Pages Functions.
10. Buka domain Cloudflare Pages Anda (misalnya `https://pos-umkm-kasir.pages.dev`).
11. Uji koneksi API dengan membuka `https://nama-domain-anda.pages.dev/api` di browser.
    Jika muncul respons JSON `{"success":true,"message":"POS UMKM API Aktif",...}`,
    maka koneksi Frontend -> Proxy -> Apps Script -> Spreadsheet telah terhubung sempurna!

--------------------------------------------------------------------------------
C. LOGIN PERTAMA & KEAMANAN AKUN ADMIN
--------------------------------------------------------------------------------
1. Buka halaman utama aplikasi Anda di browser.
2. Masukkan kredensial login awal:
   - Username : admin
   - Password : admin123
3. Klik "Masuk ke Aplikasi".
4. Pada login pertama, sistem akan otomatis menampilkan modal keamanan yang
   mewajibkan Anda mengganti password default `admin123` demi keamanan database.
5. Anda juga dapat mengubah username dan password kapan saja melalui menu
   "Pengaturan" -> bagian "Ubah Username & Password Akun Anda", atau mengelola
   akun kasir tambahan melalui menu "Manajemen Pengguna".

--------------------------------------------------------------------------------
D. CHECKLIST PENGUJIAN SISTEM (20 KRITERIA KONTROL KUALITAS)
--------------------------------------------------------------------------------
Gunakan daftar berikut untuk memverifikasi seluruh fitur berjalan pada deployment Anda:

[ ] 1.  Login            : Login menggunakan akun admin berhasil masuk ke Dashboard.
[ ] 2.  Logout           : Klik tombol Logout mengakhiri sesi & kembali ke halaman Login.
[ ] 3.  Dashboard        : Angka statistik, grafik, dan filter tanggal membaca data aktual.
[ ] 4.  Produk           : Tambah, edit, cari, filter, impor Excel, dan nonaktifkan produk.
[ ] 5.  Kategori         : Tambah, edit, dan hapus kategori produk berfungsi normal.
[ ] 6.  Kasir            : Pencarian produk/barcode, keranjang, diskon, pajak, checkout sukses.
[ ] 7.  Stok             : Stok produk berkurang otomatis saat penjualan & tercatat di mutasi.
[ ] 8.  Pembelian        : Transaksi pembelian menambah stok & pembatalan mengoreksi stok.
[ ] 9.  Pelanggan        : Tambah, edit, hapus, dan lihat riwayat belanja pelanggan.
[ ] 10. Supplier         : Tambah, edit, hapus, dan lihat nilai pembelian supplier.
[ ] 11. Keuangan         : Laba kotor (Penjualan - HPP) dan Laba bersih terhitung akurat.
[ ] 12. Pengeluaran      : Catat, edit, dan batalkan pengeluaran memotong/mengoreksi kas.
[ ] 13. Laporan          : Ke-14 jenis laporan tampil sesuai filter tanggal.
[ ] 14. PDF              : Tombol Export PDF & Unduh PDF Struk menghasilkan file .pdf valid.
[ ] 15. Excel            : Tombol Export Excel menghasilkan file .xlsx yang bisa dibuka.
[ ] 16. Dark Mode        : Tombol tema di header mengubah seluruh tampilan & tersimpan.
[ ] 17. Mobile           : Tampilan rapi di layar HP, sidebar drawer berfungsi tanpa overflow.
[ ] 18. Role             : Akun role KASIR tidak dapat mengakses Manajemen Pengguna/Pengaturan.
[ ] 19. Database         : Setiap transaksi tercatat rapi di Google Spreadsheet.
[ ] 20. API              : Tidak ada transaksi ganda saat tombol checkout diklik cepat.

--------------------------------------------------------------------------------
E. PEMECAHAN MASALAH (TROUBLESHOOTING)
--------------------------------------------------------------------------------
1. Masalah: API tidak terhubung / Error "GAS_WEB_APP_URL belum diatur".
   Solusi : Pastikan nama variabel di Cloudflare Pages Settings persis `GAS_WEB_APP_URL`
            dan Anda sudah melakukan Redeploy setelah menyimpan variabel tersebut.

2. Masalah: Muncul pesan "Google Apps Script mengembalikan halaman HTML alih-alih JSON".
   Solusi : Di Google Apps Script -> Deploy -> Manage deployments -> Edit deployment,
            pastikan opsi "Who has access" diatur ke "Anyone" (bukan "Only myself").

3. Masalah: Perubahan terbaru di `code.gs` tidak berpengaruh saat aplikasi dijalankan.
   Solusi : Di Google Apps Script, menyimpan kode (Ctrl+S) saja tidak memperbarui Web App.
            Anda wajib klik "Deploy" -> "Manage deployments" -> klik ikon Pensil (Edit) ->
            pada Version pilih "New version" -> klik "Deploy".

4. Masalah: Error CORS saat memanggil API.
   Solusi : Pastikan aplikasi diakses melalui URL Cloudflare Pages (sehingga request
            melewati `/api` pada `functions/api/[[path]].js`), bukan membuka file
            `index.html` secara langsung lewat `file://` di komputer lokal.

5. Masalah: Export PDF atau Excel tidak mengunduh file.
   Solusi : Pastikan koneksi internet aktif saat memuat halaman pertama kali agar CDN
            jsPDF dan SheetJS termuat, serta izinkan browser mengunduh file (pop-up/download).
================================================================================
