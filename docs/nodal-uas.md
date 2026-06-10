# [cite_start]NODAL (NO-DATA-ENTRY-LEDGER) VERSI 2.0 [cite: 1]
## [cite_start]ANALISIS KELEMAHAN, SOLUSI PERBAIKAN, DAN KAJIAN ASPEK KOGNITIF DALAM PERANCANGAN SISTEM MANAJEMEN KEUANGAN PERSONAL [cite: 1]


---

## [cite_start]DAFTAR ISI [cite: 12]
* [cite_start]BAB I PENDAHULUAN [cite: 14]
    * [cite_start]1.1 Latar Belakang [cite: 15]
    * [cite_start]1.2 Rumusan Masalah [cite: 16]
    * [cite_start]1.3 Tujuan [cite: 17]
* [cite_start]BAB II IDENTIFIKASI MASALAH [cite: 18]
    * [cite_start]2.1 Tujuan Analisa Kebutuhan User [cite: 19]
    * [cite_start]2.2 Kelemahan Desain NODAL Versi 1.0 [cite: 20]
* [cite_start]BAB III ANALISIS ASPEK KOGNITIVE [cite: 21]
    * [cite_start]3.1 Metode yang Digunakan [cite: 22]
    * [cite_start]3.2 Memori (Memory) [cite: 23]
    * [cite_start]3.3 Persepsi (Perception) [cite: 24]
    * [cite_start]3.4 Perilaku dan Kesalahan (Behavior and Errors) [cite: 25]
    * [cite_start]3.5 Atensi (Attention) [cite: 26]
    * [cite_start]3.6 Affordance dan Mental Model [cite: 27]
* [cite_start]BAB IV PENUTUP [cite: 28]
    * [cite_start]4.1 Kesimpulan [cite: 29]
* [cite_start]DAFTAR PUSTAKA [cite: 30]

---

## [cite_start]BAB I PENDAHULUAN [cite: 31]

### [cite_start]1.1 Latar Belakang [cite: 32]
[cite_start]Sistem manajemen keuangan merupakan suatu sistem yang dirancang untuk merencanakan, mencatat, memantau, dan mengendalikan arus keuangan secara terstruktur guna mendukung pengambilan keputusan finansial yang lebih baik[cite: 33]. [cite_start]Secara konseptual, sistem sendiri didefinisikan sebagai sekumpulan komponen yang saling berinteraksi dan bekerja sama untuk mencapai suatu tujuan tertentu (Jogiyanto, 2017)[cite: 34].

[cite_start]Dalam konteks keuangan personal, sistem manajemen keuangan berperan sebagai kerangka kerja yang membantu individu memahami kondisi finansial mereka secara menyeluruh—mulai dari pencatatan pemasukan dan pengeluaran, kategorisasi transaksi, hingga evaluasi pola konsumsi dari waktu ke waktu[cite: 35]. [cite_start]Dengan adanya sistem yang terstruktur, individu tidak lagi bergantung pada ingatan atau perkiraan semata dalam mengelola keuangannya, melainkan memiliki data yang akurat sebagai dasar perencanaan finansial yang lebih terarah dan bertanggung jawab[cite: 36].

[cite_start]Pengelolaan keuangan pribadi merupakan salah satu kebiasaan esensial yang perlu dimiliki setiap individu, termasuk mahasiswa[cite: 37]. [cite_start]Pencatatan pengeluaran harian secara konsisten memungkinkan seseorang memantau kondisi finansial, mencegah pemborosan, dan merencanakan keuangan jangka panjang secara lebih terarah[cite: 38]. [cite_start]Namun dalam praktiknya, tingkat konsistensi mahasiswa dalam mencatat pengeluaran harian masih sangat rendah[cite: 39]. Permasalahan ini tidak semata-mata berakar pada kurangnya kesadaran finansial. [cite_start]Kajian Human-Computer Interaction (HCI) mengungkap bahwa desain antarmuka aplikasi keuangan yang ada saat ini menjadi faktor penghambat yang signifikan[cite: 40].

[cite_start]Sebagian besar aplikasi manajemen keuangan konvensional membangun interaksi di atas paradigma form-based input, yang mengharuskan pengguna melewati serangkaian langkah panjang: membuka aplikasi, menavigasi menu berlapis, memilih kategori, mengetikkan nominal, menambahkan deskripsi, memilih tanggal, lalu menyimpan[cite: 41]. [cite_start]Rangkaian langkah ini menciptakan apa yang dalam kajian HCI disebut sebagai Interaction Cost yang tinggi, dikombinasikan dengan cognitive load yang berat[cite: 42].

[cite_start]Atas dasar itu, pada iterasi pertama dirancang sistem NODAL (No-Data-Entry Ledger): sebuah sistem manajemen keuangan berbasis gestur dan kecerdasan konteks (context-aware) yang mengeliminasi kebutuhan mengetik angka melalui prinsip zero typing[cite: 43]. [cite_start]Namun setelah dilakukan evaluasi kritis terhadap rancangan awal dari perspektif HCI dan psikologi kognitif, ditemukan sejumlah kelemahan mendasar yang berpotensi menggagalkan tujuan utama sistem[cite: 44]. [cite_start]Oleh karena itu, makalah ini hadir sebagai iterasi kedua: NODAL versi 2.0, yang mempertahankan kekuatan desain awal sekaligus mengintegrasikan solusi inovatif untuk setiap kelemahan yang teridentifikasi, dengan tetap berpegang pada filosofi zero typing dan prinsip-prinsip kognitif HCI[cite: 45].

---

## [cite_start]BAB II TUJUAN ANALISA KEBUTUHAN USER [cite: 46]

### [cite_start]2.1 Masalah pada Sistem Konvensional [cite: 47]
[cite_start]Analisa kebutuhan user pada sistem NODAL versi 2.0 dilakukan dengan tujuan untuk memahami secara mendalam kebutuhan, perilaku, dan ekspektasi pengguna terhadap sistem manajemen keuangan personal berbasis gestur[cite: 48]. [cite_start]Kegiatan analisa ini dipandang krusial karena desain yang baik hanya dapat dihasilkan apabila kebutuhan nyata pengguna telah diidentifikasi secara sistematis (Nielsen, 1994)[cite: 49].

[cite_start]Secara khusus, tujuan dari kegiatan analisa kebutuhan user ini meliputi: [cite: 50]
* [cite_start]Mengidentifikasi pengguna utama sistem NODAL v2.0 beserta karakteristik demografis dan teknografisnya[cite: 51].
* [cite_start]Memahami kebiasaan dan tantangan mahasiswa dalam mencatat pengeluaran harian menggunakan aplikasi konvensional[cite: 52].
* [cite_start]Menggali kebutuhan fungsional, non-fungsional, emosional, dan kontekstual yang menjadi landasan perancangan antarmuka NODAL v2.0[cite: 53].
* [cite_start]Merumuskan persona pengguna yang realistis sebagai acuan desain interaksi berbasis gestur dan prinsip zero typing[cite: 54].
* [cite_start]Memberikan rekomendasi fitur prioritas yang mendukung pengalaman pengguna (user experience) yang efisien dan menyenangkan (Norman, 2013)[cite: 55].

---

## [cite_start]BAB III METODE PENGUMPULAN DATA [cite: 56]

### [cite_start]3.1 Landasan Teori [cite: 57]
[cite_start]Dalam rangka mengumpulkan data yang akurat dan komprehensif mengenai kebutuhan pengguna sistem NODAL v2.0, digunakan tiga metode pengumpulan data sebagai berikut: [cite: 58]

### [cite_start]3.2 Wawancara (Interview) [cite: 59]
[cite_start]Metode wawancara semi-terstruktur dilakukan terhadap 5 mahasiswa aktif dari berbagai program studi yang memiliki kebiasaan mencatat pengeluaran[cite: 60]. [cite_start]Wawancara bertujuan menggali pengalaman, hambatan, dan harapan pengguna secara langsung terhadap aplikasi keuangan yang pernah digunakan[cite: 61]. [cite_start]Metode ini dipilih karena mampu menghasilkan data kualitatif yang mendalam dan memungkinkan penggalian informasi secara fleksibel sesuai respons narasumber (Shneiderman et al., 2016)[cite: 62].

### [cite_start]3.3 Observasi [cite: 63]
[cite_start]Observasi dilakukan secara naturalistik dengan mengamati perilaku mahasiswa saat mencoba mencatat pengeluaran melalui beberapa aplikasi keuangan konvensional[cite: 64]. [cite_start]Fokus pengamatan meliputi: pola navigasi, titik kesulitan (pain points), waktu yang dibutuhkan untuk menyelesaikan satu entri, dan ekspresi frustrasi pengguna[cite: 65]. [cite_start]Observasi ini sejalan dengan pendekatan analisis tugas (task analysis) dalam HCI untuk memahami konteks penggunaan nyata (Card, Moran, & Newell, 1983)[cite: 66].

### [cite_start]3.4 Survei Online [cite: 67]
[cite_start]Survei online menggunakan kuesioner terstruktur disebarkan kepada 30 responden mahasiswa[cite: 68]. [cite_start]Survei mencakup pertanyaan mengenai frekuensi pencatatan keuangan, aplikasi yang pernah digunakan, fitur yang diinginkan, dan preferensi interaksi (sentuh, gestur, atau ketik)[cite: 69]. [cite_start]Metode ini dipilih untuk mendapatkan data kuantitatif yang merepresentasikan populasi yang lebih luas dengan biaya dan waktu yang efisien (Jogiyanto, 2017)[cite: 70].

---

## [cite_start]BAB IV PROFIL PENGGUNA [cite: 71]

[cite_start]Berdasarkan hasil wawancara, observasi, dan survei yang telah dilakukan, berikut disusun dua persona pengguna utama sistem NODAL v2.0 yang mewakili karakteristik pengguna nyata[cite: 73].

### [cite_start]4.1 Persona 1: Mahasiswa Pengguna Aktif Smartphone [cite: 72]
* **Profil:** Dewa Alit Mahendra | Usia: 21 tahun | [cite_start]Pekerjaan: Mahasiswa Teknik Informatika, Semester 5[cite: 74].
* [cite_start]**Tujuan:** Mencatat seluruh pengeluaran harian secara konsisten tanpa menghabiskan banyak waktu[cite: 75]. [cite_start]Ia ingin memiliki gambaran jelas mengenai kondisi keuangannya setiap akhir bulan agar dapat menabung secara terencana[cite: 76].
* [cite_start]**Tantangan:** Sering lupa mencatat pengeluaran kecil (jajan, transportasi), merasa proses input di aplikasi konvensional terlalu panjang dan membosankan, dan cepat meninggalkan aplikasi setelah beberapa hari pemakaian[cite: 77].
* **Konteks Penggunaan:** Smartphone Android, sesekali laptop. [cite_start]Terbiasa dengan interaksi gestur dan swipe di media sosial[cite: 78]. [cite_start]Interaction Cost yang tinggi adalah musuh utamanya (Card, Moran, & Newell, 1983)[cite: 79].

### [cite_start]4.2 Persona 2: Mahasiswi dengan Kesadaran Finansial Tinggi [cite: 80]
* **Profil:** Ni Putu Ratna Sari | Usia: 22 tahun | [cite_start]Pekerjaan: Mahasiswi Manajemen Bisnis, Semester 6[cite: 81].
* [cite_start]**Tujuan:** Memantau aliran keuangan secara mendetail dengan kategorisasi yang rapi[cite: 82]. [cite_start]Ia terbiasa membuat laporan keuangan bulanan secara manual di spreadsheet dan ingin beralih ke aplikasi yang lebih praktis[cite: 83].
* [cite_start]**Tantangan:** Aplikasi yang ada kurang fleksibel dalam mengakomodasi kategori pengeluaran yang spesifik dan personal[cite: 84]. [cite_start]Ia menginginkan tampilan visualisasi yang informatif tanpa harus menavigasi banyak menu (Norman, 2013)[cite: 85].
* **Konteks Penggunaan:** Smartphone iOS dan laptop. [cite_start]Lebih menyukai antarmuka yang bersih, estetis, dan mudah dipahami[cite: 86]. [cite_start]Mental model-nya terhadap aplikasi keuangan sudah terbentuk dari penggunaan spreadsheet sebelumnya (Johnson-Laird, 1983)[cite: 87].

---

## [cite_start]BAB V HASIL ANALISA KEBUTUHAN [cite: 88]

[cite_start]Berdasarkan data yang diperoleh melalui wawancara, observasi, dan survei, berikut adalah hasil analisa kebutuhan pengguna sistem NODAL v2.0 yang dikelompokkan ke dalam empat kategori utama[cite: 90].

### [cite_start]5.1 Kebutuhan Fungsional [cite: 89]
[cite_start]Kebutuhan fungsional merupakan deskripsi layanan atau fungsi yang harus dapat dilakukan oleh sistem (Jogiyanto, 2017)[cite: 91]. Kebutuhan fungsional NODAL v2.0 meliputi:
* [cite_start]Pengguna dapat mencatat transaksi pengeluaran hanya melalui satu gestur swipe atau tap tanpa harus mengetikkan angka secara manual (zero typing)[cite: 92].
* [cite_start]Sistem mampu mengenali konteks waktu dan lokasi secara otomatis untuk menyarankan kategori pengeluaran yang relevan (context-aware input)[cite: 93].
* [cite_start]Pengguna dapat melihat ringkasan pengeluaran harian, mingguan, dan bulanan dalam bentuk visualisasi grafis yang mudah dibaca[cite: 94].
* [cite_start]Sistem menyediakan fitur pengingat (nudge) berbasis notifikasi cerdas untuk mendorong konsistensi pencatatan[cite: 95].
* [cite_start]Pengguna dapat menetapkan anggaran (budget) per kategori dan mendapatkan peringatan apabila pengeluaran mendekati batas yang ditentukan[cite: 96].

### [cite_start]5.2 Kebutuhan Non-Fungsional [cite: 97]
[cite_start]Kebutuhan non-fungsional berkaitan dengan kualitas sistem secara keseluruhan (Nielsen, 1994): [cite: 98]
* [cite_start]Antarmuka harus responsif dengan waktu respons gestur di bawah 200 milidetik agar terasa natural dan tidak mengganggu alur kognitif pengguna[cite: 99].
* [cite_start]Sistem dapat beroperasi secara offline sehingga pencatatan tidak tergantung pada koneksi internet[cite: 100].
* [cite_start]Desain visual mengikuti prinsip Gestalt untuk memaksimalkan persepsi pengguna dan mengurangi beban kognitif (Koffka, 1935)[cite: 101].
* [cite_start]Sistem harus aman dengan enkripsi data lokal dan opsi sinkronisasi berbasis cloud yang terlindungi[cite: 102].

### [cite_start]5.3 Kebutuhan Emosional [cite: 103]
[cite_start]Kebutuhan emosional mengacu pada perasaan dan pengalaman yang ingin dirasakan pengguna saat berinteraksi dengan sistem (Norman, 2013): [cite: 104]
* [cite_start]Pengguna merasa bahwa mencatat pengeluaran adalah aktivitas yang cepat dan tidak membebani, sehingga motivasi untuk konsisten tetap terjaga[cite: 105].
* [cite_start]Sistem memberikan feedback positif (visual atau haptik) setiap kali pengguna berhasil mencatat transaksi, menciptakan rasa pencapaian (sense of accomplishment)[cite: 106].
* [cite_start]Visualisasi progres keuangan memberikan rasa kendali dan kepuasan terhadap pengelolaan finansial pribadi[cite: 107].

### [cite_start]5.4 Kebutuhan Kontekstual [cite: 108]
[cite_start]Kebutuhan kontekstual mempertimbangkan kondisi nyata penggunaan sistem di lapangan (Card, Moran, & Newell, 1983): [cite: 109]
* [cite_start]Sistem digunakan dalam situasi bergerak (commuting, berjalan, antri), sehingga interaksi harus dapat dilakukan dengan satu tangan[cite: 110].
* [cite_start]Pencatatan sering terjadi langsung setelah transaksi di tempat umum, sehingga kecepatan dan kemudahan akses menjadi prioritas utama[cite: 111].
* [cite_start]Digunakan terutama pada smartphone Android dan iOS; desain harus mengikuti panduan human interface masing-masing platform[cite: 112].
* [cite_start]Pengguna berada dalam kondisi perhatian terbagi (divided attention), sehingga beban kognitif antarmuka harus diminimalkan sesuai teori Atensi Selektif (Treisman, 1964)[cite: 113].

---

## [cite_start]BAB VI KESIMPULAN [cite: 114]

### [cite_start]6.1 Pengguna Utama Sistem NODAL v2.0 [cite: 115]
[cite_start]Berdasarkan hasil analisa kebutuhan yang telah dilakukan melalui wawancara, observasi, dan survei online, pengguna utama sistem NODAL v2.0 adalah mahasiswa aktif berusia 19–24 tahun yang menggunakan smartphone sebagai perangkat utama dalam kehidupan sehari-hari[cite: 116].

[cite_start]Pengguna ini dicirikan oleh dua tipe persona, yaitu: (1) mahasiswa yang ingin mencatat pengeluaran dengan cepat dan tanpa hambatan meski belum memiliki kebiasaan keuangan yang terstruktur, dan (2) mahasiswa dengan kesadaran finansial yang lebih tinggi yang menginginkan fleksibilitas kategorisasi dan visualisasi data yang informatif[cite: 117]. [cite_start]Keduanya memiliki kesamaan mendasar, yakni menolak proses input yang panjang dan berulang, yang dalam kajian HCI dikenal sebagai interaction cost tinggi (Card, Moran, & Newell, 1983)[cite: 118].

### [cite_start]6.2 Kebutuhan Utama Pengguna [cite: 119]
[cite_start]Dari hasil analisa, kebutuhan utama pengguna sistem NODAL v2.0 dapat dirangkum dalam empat dimensi[cite: 120].

[cite_start]Secara fungsional, pengguna membutuhkan mekanisme pencatatan transaksi berbasis gestur yang mengedepankan prinsip zero typing, dilengkapi dengan saran kategori otomatis (context-aware), visualisasi ringkasan keuangan, dan fitur pengelolaan anggaran[cite: 121]. [cite_start]Secara non-fungsional, sistem harus mampu beroperasi secara offline, responsif di bawah 200 milidetik, serta memiliki desain yang mengikuti prinsip Gestalt guna meminimalkan beban kognitif (Koffka, 1935)[cite: 122].

[cite_start]Dari sisi emosional, pengguna menginginkan pengalaman yang terasa ringan, memberikan rasa pencapaian, dan membangun kepercayaan diri dalam mengelola keuangan pribadi (Norman, 2013)[cite: 123]. [cite_start]Secara kontekstual, sistem harus dapat dioperasikan dengan satu tangan dalam kondisi bergerak dan perhatian terbagi, mengingat pencatatan umumnya dilakukan sesaat setelah transaksi di tempat umum (Treisman, 1964)[cite: 124].

### [cite_start]6.3 Rekomendasi Fitur untuk Tahap Desain [cite: 125]
[cite_start]Merujuk pada seluruh temuan analisa kebutuhan di atas, berikut adalah rekomendasi fitur prioritas yang perlu diimplementasikan pada tahap desain antarmuka NODAL v2.0: [cite: 126]
* [cite_start]**Gesture-Based Quick Entry** — tombol gestur satu arah (swipe kiri/kanan/atas) untuk mencatat pengeluaran tanpa mengetik nominal, sebagai implementasi utama filosofi zero typing (Saffer, 2008; Wigdor & Wixon, 2011)[cite: 127].
* [cite_start]**Smart Context Suggestion** — sistem menyarankan kategori dan nominal berdasarkan waktu, lokasi, dan pola transaksi sebelumnya, untuk mengurangi cognitive load dan mendukung mental model pengguna (Johnson-Laird, 1983)[cite: 128].
* [cite_start]**Financial Summary Dashboard** — visualisasi ringkasan harian, mingguan, dan bulanan menggunakan grafik intuitif yang memanfaatkan prinsip pre-attentive visual attributes agar informasi terserap cepat tanpa effort besar (Ware, 2013)[cite: 129].
* [cite_start]**Positive Feedback Micro-interaction** — animasi dan respons haptik singkat setiap kali transaksi berhasil dicatat, untuk membangun kebiasaan penggunaan melalui penguatan positif dan mencegah terjadinya slip karena kurangnya konfirmasi visual (Reason, 1990)[cite: 130].
* [cite_start]**Offline-First Architecture & Budget Alert** — seluruh fitur inti dapat digunakan tanpa koneksi internet disertai notifikasi cerdas yang mengingatkan pengguna saat anggaran per kategori mendekati batas, guna mendukung konsistensi dan kontrol finansial jangka panjang (Nielsen, 1994)[cite: 131].

---

## [cite_start]DAFTAR PUSTAKA [cite: 132]
* Card, S. K., Moran, T. P., & Newell, A. (1983). The psychology of human-computer interaction. [cite_start]Lawrence Erlbaum Associates[cite: 133].
* Koffka, K. (1935). Principles of Gestalt psychology. [cite_start]Harcourt, Brace[cite: 134].
* Jogiyanto, H. M. (2017). Analisis dan desain sistem informasi. [cite_start]Andi[cite: 135].
* Johnson-Laird, P. N. (1983). Mental models. [cite_start]Harvard University Press[cite: 136].
* Miller, G. A. (1956). [cite_start]The magical number seven, plus or minus two: Some limits on our capacity for processing information[cite: 137]. [cite_start]Psychological Review, 63(2), 81–97[cite: 138].
* Nielsen, J. (1994). Usability engineering. [cite_start]Morgan Kaufmann[cite: 139].
* Norman, D. A. (1988). The psychology of everyday things. [cite_start]Basic Books[cite: 140].
* Norman, D. A. (2013). The design of everyday things (Revised ed.). [cite_start]Basic Books[cite: 141].
* Reason, J. (1990). Human error. [cite_start]Cambridge University Press[cite: 142].
* Saffer, D. (2008). Designing gestural interfaces. [cite_start]O'Reilly Media[cite: 143].
* [cite_start]Shneiderman, B., Plaisant, C., Cohen, M., Jacobs, S., & Elmqvist, N. (2016)[cite: 144]. Designing the user interface: Strategies for effective human-computer interaction (6th ed.). [cite_start]Pearson[cite: 145].
* Treisman, A. (1964). Selective attention in man. [cite_start]British Medical Bulletin, 20(1), 12–16[cite: 146].
* Ware, C. (2013). Information visualization: Perception for design (3rd ed.). [cite_start]Morgan Kaufmann[cite: 147].
* Wigdor, D., & Wixon, D. (2011). Brave NUI world: Designing natural user interfaces for touch and gesture. [cite_start]Morgan Kaufmann[cite: 148].