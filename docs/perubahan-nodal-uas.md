# Rekomendasi Perubahan dan Pembaruan Dokumen `nodal-uas.md`

Dokumen ini disusun untuk membantu Anda merevisi dan menyelaraskan makalah akademik `nodal-uas.md` dengan implementasi nyata pada kode aplikasi **NODAL v2.0** serta temuan teknis dari `project_analysis_report.md`.

---

## 1. Analisis Struktur & Inkonsistensi Dokumen (Critical Issue)

Terdapat ketidaksesuaian yang sangat signifikan antara **Daftar Isi** di bagian awal makalah dengan **Batang Tubuh** (Isi Bab) yang sebenarnya Anda tulis. Berikut adalah pemetaannya:

| Bagian | Tertera di Daftar Isi | Realita di Batang Tubuh Dokumen | Rekomendasi Perbaikan |
| :--- | :--- | :--- | :--- |
| **Bab I** | 1.1 Latar Belakang<br>1.2 Rumusan Masalah<br>1.3 Tujuan | Hanya ada Sub-bab 1.1 Latar Belakang. | Tambahkan Sub-bab **1.2 Rumusan Masalah** dan **1.3 Tujuan** agar sesuai dengan Daftar Isi. |
| **Bab II** | **IDENTIFIKASI MASALAH**<br>2.1 Tujuan Analisa Kebutuhan User<br>2.2 Kelemahan Desain NODAL v1.0 | Berubah judul menjadi:<br>**TUJUAN ANALISA KEBUTUHAN USER**<br>Hanya berisi 2.1 Masalah pada Sistem Konvensional. | Samakan judul Bab II. Tulis kembali Sub-bab **2.2 Kelemahan Desain NODAL v1.0** (terkait hilangnya data saat hapus cache, tidak adanya sinkronisasi, dll). |
| **Bab III** | **ANALISIS ASPEK KOGNITIF**<br>3.1 Metode yang Digunakan<br>3.2 Memori, 3.3 Persepsi, dll. | Berubah judul menjadi:<br>**METODE PENGUMPULAN DATA**<br>Berisi Wawancara, Observasi, Survei. | **Sangat Fatal**: Kajian Teori Aspek Kognitif (Memori, Persepsi, Atensi, dll) sesuai janji judul makalah hilang total. Anda harus membuat ulang struktur Bab III agar materi kognitif ini masuk kembali. |
| **Bab IV** | **PENUTUP**<br>4.1 Kesimpulan | Berubah judul menjadi:<br>**PROFIL PENGGUNA** (Berisi Persona 1 & 2). | Pindahkan Profil Pengguna ini menjadi bagian dari Bab II atau Bab V, dan kembalikan Bab IV untuk Penutup. |
| **Bab V** | Tidak Terdaftar di Daftar Isi | **HASIL ANALISA KEBUTUHAN** (Fungsional, Non-Fungsional, dll). | Masukkan Bab V ini ke dalam Daftar Isi. |
| **Bab VI** | Tidak Terdaftar di Daftar Isi | **KESIMPULAN** (Pengguna Utama, Kebutuhan, Rekomendasi). | Masukkan Bab VI ini ke dalam Daftar Isi. |

---

## 2. Kesenjangan Klaim Makalah vs Realita Kode Aplikasi (Gaps)

Dalam makalah, Anda membuat beberapa klaim fungsionalitas sistem yang belum sepenuhnya cocok dengan kode yang diimplementasikan. Anda perlu merevisi klaim tersebut agar bersifat realistis atau menjelaskannya sebagai "pengembangan masa depan":

1. **Konteks Lokasi Otomatis (`Smart Context Suggestion`)**
   - *Klaim di Makalah (5.1 & 6.3)*: *"Sistem mampu mengenali konteks waktu dan lokasi secara otomatis..."*
   - *Realita Kode*: Kode saat ini hanya mendeteksi konteks **waktu** (pagi, siang, sore, malam) untuk memunculkan Smart Tags, tetapi **tidak mendeteksi koordinat lokasi/GPS**.
   - *Rekomendasi*: Ubah kalimat di makalah menjadi fokus pada konteks waktu dan riwayat transaksi, atau tandai pendeteksian lokasi berbasis GPS sebagai fitur rencana masa depan (*Future Work*).

2. **Keamanan Data Cloud & Enkripsi**
   - *Klaim di Makalah (5.2)*: *"Sistem harus aman dengan enkripsi data lokal dan opsi sinkronisasi berbasis cloud yang terlindungi."*
   - *Realita Kode*: Database lokal (Dexie) disimpan dalam teks biasa di IndexedDB browser tanpa enkripsi, dan Server Action `syncData` rentan terhadap IDOR (belum ada validasi session token / JWT pada transaksi database).
   - *Rekomendasi*: Nyatakan aspek keamanan ini sebagai standar non-fungsional yang direkomendasikan pada rilis produksi, bukan sesuatu yang sudah berjalan penuh di prototipe saat ini.

3. **Anggaran per Kategori (`Category Budgets`)**
   - *Klaim di Makalah (5.1 & 6.3)*: *"mengingatkan pengguna saat anggaran per kategori mendekati batas..."*
   - *Realita Kode*: UI aplikasi saat ini hanya menghitung dan menampilkan **Anggaran Bulanan Global Tunggal** (limit Rp 1.500.000). Meskipun skema database mendukung `categoryId` pada anggaran, logika visualisasi kategori per kategori belum diimplementasikan di dashboard.

---

## 3. Materi Tambahan yang Perlu Dimasukkan ke `nodal-uas.md`

Untuk memperkuat nilai akademik UAS Anda, masukkan analisis tantangan teknis offline-first dan interaksi kognitif dari `project_analysis_report.md` ke dalam makalah Anda.

Berikut adalah draf teks berbahasa Indonesia yang bisa langsung Anda sisipkan pada bab yang relevan:

### A. Sisipan untuk Bab II / Bab V (Tantangan Keamanan & Mental Model Pengguna)
> **Analisis Risiko Autentikasi pada Sistem Offline-First:**
> Karakteristik aplikasi offline-first yang mengijinkan pencatatan instan tanpa koneksi internet memunculkan tantangan kognitif tersendiri bagi pengguna terkait rasa aman (*trust*). Pengguna memiliki model mental bahwa data mereka tersimpan secara lokal dan privat. Namun, ketika proses sinkronisasi awan (cloud sync) terjadi, keamanan data menjadi rapuh jika server action hanya memercayai payload identitas (`userId`) yang dikirim dari klien tanpa otorisasi terpusat. Ke depan, integrasi otentikasi menggunakan standar Better Auth mutlak diperlukan di mana pencocokan ID pengguna dilakukan langsung di sisi server menggunakan token sesi terenkripsi, guna menghindari celah keamanan IDOR (*Insecure Direct Object Reference*).

### B. Sisipan untuk Bab III / Bab V (Resolusi Konflik & Beban Kognitif)
> **Resolusi Konflik Data dan Konsistensi Kognitif:**
> Ketika pengguna menggunakan NODAL di berbagai perangkat dalam kondisi offline, sinkronisasi data dapat menimbulkan konflik balapan (*race condition*). Jika sistem menerapkan aturan Last-Write-Wins (LWW) secara naif tanpa membandingkan stempel waktu aktual (`updatedAt`) antara perangkat klien dan database awan, pembaruan data yang lebih usang dapat menimpa data yang lebih baru. Dari perspektif HCI, inkonsistensi data pasca-sinkronisasi ini akan merusak model mental pengguna terhadap reliabilitas sistem, meningkatkan beban kognitif frustrasi (*frustration-driven cognitive load*), dan menurunkan tingkat kepercayaan pengguna secara drastis. Solusinya adalah implementasi pengecekan timestamp ketat di sisi server sebelum melakukan operasi *upsert*.

---

## 4. Langkah-langkah Rekomendasi Tindakan

1. **Perbaiki Daftar Isi**:
   Pastikan Daftar Isi di `nodal-uas.md` mencerminkan isi bab yang sebenarnya ditulis di bawahnya (Latar Belakang, Identifikasi Masalah, Profil Pengguna, Analisis Kebutuhan, Kesimpulan, Daftar Pustaka).
2. **Koreksi Klaim Fitur**:
   Sesuaikan klaim deteksi lokasi otomatis dan anggaran kategori di dokumen agar selaras dengan kemampuan prototipe kode saat ini.
3. **Tambahkan Teori Kognitif**:
   Jika dosen Anda mewajibkan analisis aspek kognitif (sesuai judul Bab III di Daftar Isi Anda: Memori, Persepsi, Atensi, dll), Anda harus melengkapi Bab III dengan teori-teori tersebut daripada hanya berisi metode pengumpulan data saja.
