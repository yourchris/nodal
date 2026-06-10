## **NODAL v2.0 Product Requirements Document** 

## **(PRD)** 

## **Overview** 

NODAL (No Data Entry Ledger) adalah aplikasi manajemen keuangan personal yang dirancang untuk mengurangi interaction cost dalam pencatatan pengeluaran harian melalui pendekatan Zero Typing. 

Target utama pengguna adalah mahasiswa usia 19–24 tahun yang mengalami kesulitan menjaga konsistensi pencatatan keuangan karena proses input yang panjang dan membosankan. 

## **Goals** 

## **Business Goals** 

- Meningkatkan frekuensi pencatatan transaksi harian 

- Mengurangi waktu input transaksi hingga < 3 detik 

- Menciptakan pengalaman pencatatan yang lebih ringan dibanding aplikasi keuangan konvensional 

## **User Goals** 

- Mencatat pengeluaran dengan cepat 

- Melihat kondisi keuangan secara instan 

- Mengetahui batas pengeluaran bulanan 

- Tidak perlu mengetik berulang kali 

## **User Persona** 

## **Persona 1** 

Mahasiswa aktif 

Pain Points: 

- Lupa mencatat transaksi 

- Malas mengisi form panjang 

- Tidak konsisten menggunakan aplikasi keuangan 

1 

## **Persona 2** 

Mahasiswa sadar finansial 

Pain Points: 

- Membutuhkan visualisasi yang lebih jelas 

- Ingin kategorisasi yang fleksibel 

- Ingin laporan yang mudah dibaca 

## **Features** 

## **1. Authentication** 

## **User Registration** 

Fields: 

- Name 

- Email 

- Password 

## **User Login** 

Fields: 

- Email 

- Password 

## **2. Quick Entry (Core Feature)** 

### **Gesture Actions**

- **Swipe Left**: Mencatat pengeluaran kategori makanan secara cepat.
- **Swipe Right**: Mencatat pengeluaran kategori transportasi secara cepat.
- **Swipe Up**: Mencatat pengeluaran kategori hiburan secara cepat.
- **Swipe Down / Tap**: Membuka modal daftar kategori lengkap untuk pilihan kategori lainnya.

### **Alur Input Nominal Uang & Labeling (Zero Typing)**

Untuk mencapai pengalaman pencatatan tanpa ketik berulang (Zero Typing), alur input nominal dan pemberian label detail transaksi didefinisikan sebagai berikut:

1. **Trigger Gesture**: Pengguna melakukan swipe ke salah satu arah (misal Swipe Left untuk Makanan).
2. **Numpad & Preset Pop-up**: Modal overlay minimalis langsung muncul di bagian bawah layar secara instan.
3. **Smart Presets & Smart Tags**: 
   - Sistem menampilkan 4 tombol nominal rekomendasi pintar berdasarkan riwayat transaksi.
   - Sistem menampilkan 4 tombol **Smart Tags** (chip label cepat) yang disesuaikan secara dinamis berdasarkan jam transaksi saat ini dan kategori (contoh untuk Makanan di siang hari: `[Makan Siang]`, `[Minuman]`, `[Kantin]`, `[Camilan]`).
4. **Default Smart Auto-Save (0 Interaction)**: 
   - Jika pengguna didiamkan selama **3.0 detik**, transaksi otomatis disimpan menggunakan nominal rekomendasi utama dan diberi catatan **Contextual Default Label** berbasis jam saat ini (misal jam 12:30 siang otomatis dicatat dengan keterangan `"Makan Siang"`).
   - Pengguna juga dapat melakukan **Double Tap** pada layar untuk langsung menyimpan dengan nominal rekomendasi dan label default tersebut.
5. **Instant Tag Saving (1 Tap)**: Pengguna dapat mengetuk salah satu dari 4 chip **Smart Tags** untuk langsung menyimpan transaksi dengan nominal rekomendasi utama dan label tag tersebut secara instan (timer dihentikan dan modal ditutup).
6. **Quick Numeric Input & Custom Label**: Jika ingin nominal berbeda, pengguna mengetik angka pada numpad (timer otomatis dibatalkan). Pengguna kemudian dapat mengetuk salah satu Smart Tags untuk menyimpannya dengan label tersebut, atau menekan tombol centang untuk menyimpan dengan label default berbasis jam.

### **Kustomisasi Gesture**

- Pengguna dapat menyesuaikan pemetaan gesture swipe (Left, Right, Up, Down) di halaman Pengaturan.
- Setiap gesture dapat diasosiasikan dengan kategori pengeluaran buatan pengguna sendiri maupun kategori bawaan sistem.

## **Acceptance Criteria** 

- Respon gesture < 200ms hingga modal popup muncul.
- Transaksi terdaftar di IndexedDB lokal secara instan (< 50ms) setelah konfirmasi nominal.
- Navigasi dan konfirmasi nominal dapat dilakukan sepenuhnya dengan satu tangan (one-hand interaction). 

## **3. Smart Suggestion** 

Sistem mempelajari: 

- Jam transaksi 

- Hari transaksi 

- Riwayat transaksi 

Contoh: 

08:00 → Sarapan 

12:00 → Makan Siang 

18:00 → Makan Malam 

## **4. Dashboard** 

Menampilkan: 

- Total pengeluaran hari ini 

- Total pengeluaran minggu ini 

- Total pengeluaran bulan ini 

- Budget progress 

- Grafik pengeluaran 

## **5. Transaction History** 

Filter: 

- Hari 

- Minggu 

3 

- Bulan 

Actions: 

- Edit 

- Delete 

## **6. Budget Management** 

User dapat: 

- Membuat budget 

- Mengatur limit per kategori 

- Melihat progress penggunaan 

## **7. Analytics** 

Menampilkan: 

- Kategori terbesar 

- Tren pengeluaran 

- Perbandingan bulan sebelumnya 

## **8. Detailed Manual Entry (Secondary Flow)** 

Halaman alternatif pencatatan transaksi untuk pencatatan mendalam ketika pengguna tidak sedang terburu-buru.

**Fields**:
- **Nominal (Amount)**: Input numeric lengkap (Rp).
- **Kategori (Category)**: Dropdown pilihan kategori yang aktif.
- **Tanggal & Waktu (Date & Time)**: Pilihan tanggal/waktu transaksi (default saat ini, mendukung *backdating*).
- **Catatan (Note)**: Textarea bebas untuk deskripsi detail barang/lokasi belanja.

- Dapat diakses melalui tombol/tab **"Manual"** di bottom navigation bar, tepat di antara tombol **"Ledger"** dan **"Riwayat"**.

**Acceptance Criteria**:
- Transaksi terdaftar di IndexedDB lokal secara instan dan memicu sinkronisasi latar belakang jika online.
- Melakukan redirect ke halaman utama `/` (Ledger) setelah menekan tombol Simpan.

## **Non Functional Requirements** 

## **Performance** 

- Load page < 2 detik 

- Gesture response < 200 ms 

## **Security** 

- Password hashing 

- Session management 

- HTTPS only 

## **Availability & Offline-First Strategy** 

- **Offline-first Architecture**: Aplikasi menyimpan dan membaca data transaksi sepenuhnya secara lokal menggunakan IndexedDB (via Dexie.js). Pengguna dapat melakukan pencatatan, pengeditan, dan penghapusan transaksi meskipun tanpa koneksi internet.
- **Mekanisme Sinkronisasi (Sync Engine)**:
  - Setiap perubahan data (tambah, edit, hapus) di IndexedDB lokal ditandai dengan status boolean `synced: false`.
  - Sistem memantau status koneksi internet browser (`window.addEventListener('online', ...)`).
  - Ketika koneksi online terdeteksi, antrean transaksi yang belum tersinkron (`synced: false` atau `deleted: true`) dikirim ke PostgreSQL melalui Next.js Server Actions secara bertahap di latar belakang.
  - Setelah server mengonfirmasi penyimpanan data di PostgreSQL, status transaksi di database lokal diperbarui menjadi `synced: true`.
- **Penanganan Konflik (Conflict Resolution)**:
  - Menggunakan strategi **Last-Write-Wins (LWW)** berdasarkan field `updated_at`. Data dengan waktu pembaruan terbaru yang akan menggantikan data lama.
- **Soft Deletion**:
  - Untuk melacak penghapusan transaksi saat offline, transaksi ditandai dengan `deleted: true` secara lokal.
  - Saat sinkronisasi berjalan, server akan menghapus baris transaksi tersebut dari database PostgreSQL, kemudian data tersebut dihapus secara fisik dari database lokal (Dexie.js). 

## **Usability** 

- Mobile-first 

- One hand interaction 

- Minimal cognitive load 

## **Tech Stack** 

Frontend: 

- Next.js 

- TypeScript 

- TailwindCSS 

- Shadcn UI 

Backend: 

- Next.js Server Actions 

Database: 

- PostgreSQL (Neon) 

ORM: 

- Drizzle ORM 

Authentication: 

- Better Auth 

Deployment: 

- Vercel 

Offline: 

- IndexedDB 

- Dexie.js 

Charts: 

• Recharts 

5 

## **Database Design (Schema)**

### **Core Application Tables**

#### **Users**
- `id` (Text / UUID) - Primary Key
- `name` (Text)
- `email` (Text) - Unique, Indexed
- `password_hash` (Text) - Nullable (untuk mendukung OAuth login)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### **Transactions**
- `id` (Text / UUID) - Primary Key
- `user_id` (Text) - Foreign Key to `Users.id`
- `category_id` (Text) - Foreign Key to `Categories.id`
- `amount` (Decimal / Integer) - Nominal transaksi
- `note` (Text) - Catatan tambahan (Nullable)
- `synced` (Boolean) - Default `false` (*Digunakan di database lokal Dexie.js*)
- `deleted` (Boolean) - Default `false` (*Soft delete untuk sinkronisasi*)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### **Categories**
- `id` (Text / UUID) - Primary Key
- `user_id` (Text) - Foreign Key to `Users.id` (Nullable untuk Kategori Default Sistem)
- `name` (Text) - Nama kategori (makanan, transportasi, hiburan, dll.)
- `icon` (Text) - Nama ikon (dari Lucide React / React Icons)
- `synced` (Boolean) - Default `false` (*Digunakan di database lokal Dexie.js*)
- `deleted` (Boolean) - Default `false` (*Soft delete*)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### **Budgets**
- `id` (Text / UUID) - Primary Key
- `user_id` (Text) - Foreign Key to `Users.id`
- `category_id` (Text) - Foreign Key to `Categories.id`
- `limit_amount` (Decimal / Integer) - Batas nominal budget bulanan
- `current_amount` (Decimal / Integer) - Akumulasi pengeluaran berjalan
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### **UserGestures**
- `id` (Text / UUID) - Primary Key
- `user_id` (Text) - Foreign Key to `Users.id`
- `gesture` (Text) - Jenis gesture (`swipe_left`, `swipe_right`, `swipe_up`, `swipe_down`)
- `category_id` (Text) - Foreign Key to `Categories.id`
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### **Better Auth Integration Tables**

#### **sessions**
- `id` (Text) - Primary Key
- `userId` (Text) - Foreign Key to `Users.id`
- `token` (Text) - Unique
- `expiresAt` (Timestamp)
- `ipAddress` (Text) - Nullable
- `userAgent` (Text) - Nullable
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

#### **accounts**
- `id` (Text) - Primary Key
- `userId` (Text) - Foreign Key to `Users.id`
- `accountId` (Text)
- `providerId` (Text) - OAuth Provider (google, github, dsb.) atau "credential"
- `accessToken` (Text) - Nullable
- `refreshToken` (Text) - Nullable
- `expiresAt` (Timestamp) - Nullable
- `password` (Text) - Nullable
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

#### **verifications**
- `id` (Text) - Primary Key
- `identifier` (Text)
- `token` (Text)
- `expiresAt` (Timestamp)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp) 

## **Future Features** 

Phase 2 

- AI Spending Insight 

- OCR Receipt Scanner 

- Voice Input 

- Export PDF 

6 

Phase 3 

- Bank Integration 

- Shared Budget 

- Financial Coaching 

## **Success Metrics** 

- Daily Active Users 

- Monthly Active Users 

- Retention 30 Days 

- Average Transactions per User 

- Budget Usage Rate 

- User Satisfaction Score 

7 

