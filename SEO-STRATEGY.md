# SEO STRATEGY — Website Souvenir Kantor

Pelengkap `PRD.md` dan `DESIGN.md`.
**Stack:** Bootstrap 5 · HTML · CSS · Vanilla JS · Firebase (Firestore)
**Placeholder yang perlu diisi:** `[Brand]`, `[Kota]`, `[Domain]`.

> **Catatan jujur tentang data:** dokumen ini belum memuat angka volume pencarian. Angka itu harus diambil dari Google Keyword Planner dan Google Search Console (langkahnya ada di bagian 3.5). Prioritas keyword di bawah adalah penilaian berdasarkan maksud pencarian dan nilai bisnis, bukan berdasarkan volume.

---

## 1. Ringkasan Strategi

| Hal | Keputusan |
|---|---|
| **Tujuan** | Mendatangkan calon pelanggan B2B (HRD, panitia acara, procurement, EO, instansi) yang siap meminta penawaran lewat WhatsApp/form |
| **Pendekatan** | Jangan menantang keyword kepala (*head term*) lebih dulu. Menangkan **long-tail spesifik** (produk + custom logo + kebutuhan + kota), lalu naik ke keyword yang lebih besar |
| **Pilar 1 — Teknis** | Setiap produk dan artikel punya **URL sendiri yang bisa diindeks** dengan HTML yang sudah terisi (pre-render), bukan hanya modal/JS |
| **Pilar 2 — Konten** | Halaman produk yang kaya data nyata + blog yang menjawab pertanyaan pembeli korporat |
| **Pilar 3 — Lokal** | Google Business Profile, konsistensi NAP, ulasan |
| **Pilar 4 — Otoritas** | Portofolio klien, studi kasus, tautan masuk yang wajar |
| **Pilar 5 — AEO/GEO** | Jawaban singkat di awal, tabel spesifikasi, FAQ asli, entitas bisnis yang konsisten |

---

## 2. Lanskap Pencarian (Hasil Pengamatan)

Dari pencarian kata seperti "souvenir kantor custom logo", "souvenir custom logo", dan "merchandise seminar":
- Hasil produk didominasi **marketplace dan direktori B2B** (Tokopedia, Indotrading). Satu pencarian "souvenir custom logo" di Tokopedia saja menampilkan ribuan produk.
- Pesaing memakai pola kata yang sama berulang: *custom logo, embos/grafir/sablon, souvenir seminar kit, hadiah karyawan, hampers korporat, grosir, minimal order, untuk perusahaan/instansi*.
- Konten yang muncul untuk vendor kecil umumnya katalog tipis. Artikel panduan yang benar-benar menjawab keputusan pembeli (budget, teknik cetak, waktu produksi, cara order) masih peluang.

**Implikasi:**
1. Situs baru sulit menang di "souvenir kantor" saja dalam waktu singkat. Mulai dari kombinasi spesifik.
2. Marketplace tidak perlu dilawan, tetapi bisa dipakai sebagai kanal tambahan yang diarahkan kembali ke website (profil toko mencantumkan domain).
3. Pembeda utama website: **harga mulai, minimal order, waktu produksi, mockup gratis, portofolio klien**. Semuanya harus tertulis jelas di halaman.

---

## 3. Riset & Arsitektur Keyword

### 3.1 Cluster Keyword

Aturan: **satu URL = satu keyword utama** + variasi alaminya. Jangan membuat dua halaman untuk maksud pencarian yang sama (kanibalisasi).

#### A. Inti (brand category)
| Keyword | Maksud | URL Target | Prioritas |
|---|---|---|---|
| souvenir kantor | Campuran | Beranda | P1 |
| souvenir perusahaan | Komersial | Beranda / `produk/` | P1 |
| souvenir kantor custom logo | Transaksional | `produk/` | P1 |
| merchandise perusahaan / merchandise kantor | Komersial | `produk/` | P2 |
| barang promosi perusahaan | Komersial | `produk/` | P2 |
| vendor souvenir kantor | Transaksional | Beranda / Tentang | P1 |

#### B. Produk (halaman kategori dan detail produk)
Sesuaikan dengan produk yang benar-benar dijual.

| Keyword | URL Target | Prioritas |
|---|---|---|
| tumbler custom logo | `produk/kategori/tumbler/` + detail | P1 |
| mug custom logo | kategori/detail | P2 |
| pulpen custom logo / pulpen promosi | kategori/detail | P1 |
| tote bag custom / goodie bag custom | kategori/detail | P1 |
| agenda / notebook custom logo | kategori/detail | P1 |
| seminar kit custom | kategori/detail | P1 |
| payung custom logo | kategori/detail | P2 |
| powerbank custom logo | kategori/detail | P2 |
| gantungan kunci custom | kategori/detail | P3 |
| jam dinding / jam meja custom | kategori/detail | P3 |
| hampers korporat | kategori/detail | P1 (musiman) |
| gift set perusahaan | kategori/detail | P2 |

#### C. Kebutuhan / Acara
| Keyword | URL Target | Prioritas |
|---|---|---|
| souvenir seminar / souvenir pelatihan | Artikel pilar + halaman kategori | P1 |
| souvenir gathering kantor | Artikel | P2 |
| souvenir ulang tahun perusahaan | Artikel | P2 |
| hadiah karyawan / employee gift | Artikel | P2 |
| souvenir untuk klien / client gift | Artikel | P3 |
| hampers lebaran / natal / tahun baru kantor | Artikel musiman + kategori | P1 (musiman) |

#### D. Pengubah transaksional (digabung ke A–C)
`murah` · `grosir` · `minimal order` · `harga` · `jual` · `pesan` · `produsen/vendor/supplier` · `terdekat` · `[Kota]`

> Hindari menulis "murah" di judul bila positioning situs adalah premium. Pakai di isi halaman secukupnya atau ganti dengan "harga terjangkau" / "harga mulai".

#### E. Lokal
`souvenir kantor [Kota]` · `vendor souvenir [Kota]` · `pembuat merchandise [Kota]` · `souvenir custom logo [Kota]` → halaman Beranda, Tentang, Kontak, dan Google Business Profile.

#### F. Informasional (blog)
`ide souvenir kantor` · `souvenir seminar yang bermanfaat` · `cara memilih souvenir perusahaan` · `sablon vs laser engraving vs bordir` · `anggaran souvenir per orang` · `cara pesan souvenir custom` · `tren souvenir kantor`

### 3.2 Peta URL (disarankan)

| Halaman | URL | Keyword Utama |
|---|---|---|
| Beranda | `/` | souvenir kantor + vendor [Kota] |
| Tentang | `/tentang/` | vendor souvenir kantor [Kota] |
| Katalog | `/produk/` | souvenir kantor custom logo |
| Kategori | `/produk/kategori/<slug>/` | tumbler custom logo, dst. |
| Detail Produk | `/produk/<slug>/` | nama produk + custom logo |
| Galeri | `/galeri/` | portofolio souvenir custom perusahaan |
| Blog (indeks) | `/blog/` | blog souvenir kantor |
| Artikel | `/blog/<slug>/` | per artikel |
| Kontak | `/kontak/` | pesan souvenir kantor [Kota] |

Aturan URL: huruf kecil, kata dipisah tanda hubung, tanpa parameter untuk konten yang ingin diindeks, slug pendek dan mengandung keyword.

### 3.3 Template On-Page

**Title** (± 50–60 karakter) dan **Meta description** (± 140–155 karakter). Ini panduan, bukan batas keras; Google bisa menulis ulang.

| Halaman | Title | Meta Description |
|---|---|---|
| Beranda | `Souvenir Kantor Custom Logo untuk Perusahaan \| [Brand]` | `Vendor souvenir kantor [Kota]: tumbler, tote bag, notebook, seminar kit dengan logo perusahaan Anda. Mockup gratis, minimal order [X] pcs.` |
| Katalog | `Katalog Souvenir Kantor & Merchandise Perusahaan \| [Brand]` | `Lihat pilihan souvenir kantor custom logo untuk seminar, gathering, dan hadiah karyawan. Harga mulai, bahan, dan minimal order tertera jelas.` |
| Kategori | `{Kategori} Custom Logo — Harga Mulai Rp{X} \| [Brand]` | `{Kategori} custom logo untuk perusahaan: pilihan bahan, teknik cetak, dan waktu produksi {X} hari kerja. Minta penawaran via WhatsApp.` |
| Detail Produk | `{Produk} Custom Logo, Min. {X} pcs \| [Brand]` | `{Produk}: bahan {…}, ukuran {…}, cetak {sablon/laser/bordir}. Harga mulai Rp{X}/pcs. Mockup gratis sebelum produksi.` |
| Tentang | `Tentang [Brand] — Vendor Souvenir Kantor [Kota]` | `Profil [Brand]: pengalaman, proses produksi, dan klien yang sudah kami layani untuk souvenir kantor dan merchandise perusahaan.` |
| Galeri | `Portofolio Souvenir Custom Perusahaan \| [Brand]` | `Hasil pengerjaan souvenir custom untuk seminar, gathering, dan acara perusahaan. Lihat contoh nyata dari klien kami.` |
| Blog | `Blog Souvenir Kantor: Ide, Tips, dan Panduan \| [Brand]` | `Panduan memilih souvenir kantor, teknik cetak logo, anggaran per orang, dan ide hadiah karyawan dari tim [Brand].` |
| Kontak | `Pesan Souvenir Kantor — Hubungi [Brand]` | `Konsultasi dan minta penawaran souvenir kantor via WhatsApp 082232730246 atau form. Respons di jam kerja.` |

**Aturan penempatan keyword:** keyword utama muncul di `title`, `h1` (satu per halaman), 100 kata pertama, URL, `alt` gambar utama, dan minimal satu `h2`. Pakai variasi alami; jangan mengejar persentase kepadatan.

### 3.4 Template Halaman Produk (kunci untuk keyword produk)

Setiap produk wajib memuat data yang sungguh-sungguh dapat dipakai pembeli:

1. `h1`: `{Produk} Custom Logo`
2. Kalimat jawaban singkat 1–2 baris (apa produknya, untuk siapa, minimal order).
3. **Tabel spesifikasi:** bahan, ukuran/kapasitas, warna tersedia, teknik cetak yang bisa dipilih, area cetak, minimal order, harga mulai, waktu produksi, kemasan.
4. Galeri foto: produk polos + hasil dengan logo klien.
5. Tombol utama: **Pesan via WhatsApp** (pesan otomatis menyebut nama produk).
6. FAQ produk (3–5 pertanyaan nyata dari calon pembeli).
7. Produk terkait + tautan ke artikel panduan yang relevan.
8. Breadcrumb: `Beranda / Produk / Kategori / {Produk}`.

> Jika harga tidak bisa dipublikasikan, tulis "harga menyesuaikan jumlah, minta penawaran". Jangan mengarang harga.

### 3.5 Cara Mendapatkan Data Volume & Memprioritaskan

1. **Google Keyword Planner** (gratis dengan akun Google Ads): masukkan keyword cluster di atas → ekspor volume bulanan dan tingkat persaingan.
2. **Google Search Console** (setelah situs live): lihat kueri nyata yang memunculkan situs.
3. **Autosuggest, People Also Ask, dan Related Searches** Google: catat pertanyaan nyata.
4. **Audit pesaing:** buka 5 hasil teratas per keyword utama; catat jenis halamannya (marketplace/vendor/artikel), jumlah kata, dan apa yang belum mereka jawab.
5. **Skor prioritas** per keyword (skala 1–5): `Nilai bisnis × Kemungkinan menang × Volume`. Kerjakan dari skor tertinggi.

Kolom spreadsheet yang disarankan: `Keyword | Cluster | Maksud | Volume | Persaingan | URL target | Status | Posisi saat ini | Catatan`.

---

## 4. Fondasi Teknis (Penting untuk Stack Firebase)

### 4.1 Risiko Utama: Konten Dimuat Lewat JavaScript

Google dapat menjalankan JavaScript, tetapi halaman masuk antrean render dan bisa tertunda; Google sendiri menyatakan pre-render atau server-side rendering tetap ide yang bagus karena lebih cepat dan tidak semua bot dapat menjalankan JavaScript. Crawler AI juga tidak boleh diandalkan untuk merender JS. Karena produk dan blog di rancangan ini diambil dari Firestore di sisi klien, **konten penting bisa kosong di HTML awal**.

### 4.2 Perubahan yang Direkomendasikan pada PRD

PRD v1.0 memiliki dua keputusan yang merugikan SEO. Disarankan direvisi:

| Di PRD | Masalah SEO | Revisi |
|---|---|---|
| Detail produk berupa **modal** | Tidak ada URL → tidak ada halaman yang bisa diindeks untuk keyword produk | Buat **halaman detail produk** `/produk/<slug>/` |
| Detail blog `blog-detail.html?slug=...` | URL berparameter, metadata diisi JS, mudah jadi duplikat/soft 404 | Pakai **URL bersih** `/blog/<slug>/` |
| Filter kategori hanya pil JS | Kategori tidak bisa diindeks | Buat **halaman kategori** `/produk/kategori/<slug>/` |
| Tombol "Muat lebih banyak" | Link produk tidak ada di HTML | Pagination dengan **tautan `<a href>` nyata**, atau semua produk ada di sitemap |

### 4.3 Opsi Rendering

| Opsi | Cara | Kelebihan | Kekurangan |
|---|---|---|---|
| **A. Pre-render saat build (disarankan)** | Skrip Node dijalankan saat deploy: membaca Firestore (Admin SDK / REST), menghasilkan file HTML statis untuk produk, kategori, artikel, plus `sitemap.xml` | HTML lengkap untuk bot & AI, cepat, tidak butuh server | Setelah admin mengubah data, perlu rebuild (tombol "Publikasikan" di admin memicu deploy hook) |
| **B. Hybrid** | HTML statis hasil build sebagai dasar, lalu JS memperbarui data terbaru dari Firestore | SEO kuat + data selalu segar | Sedikit lebih kompleks |
| **C. Murni client-side** | Seperti PRD saat ini | Paling sederhana | Paling berisiko untuk indeks & AI search |

**Rekomendasi:** Opsi B. Alur praktis untuk admin non-teknis: admin menyimpan data → data langsung tampil di situs lewat JS → tombol **"Publikasikan ke Google"** di admin memicu rebuild statis (Vercel Deploy Hook atau GitHub Actions `workflow_dispatch`). Rebuild otomatis terjadwal harian juga bisa jadi cadangan.

Jika tetap memakai Opsi C untuk sementara, minimal:
- Teks inti (hero, tentang, deskripsi kategori) ditulis langsung di HTML.
- `<title>`, meta description, canonical, dan JSON-LD diisi per halaman dan diuji di **URL Inspection → Test Live URL** (lihat HTML hasil render).
- Link internal memakai `<a href>` asli (bukan `onclick`).
- Slug yang tidak ditemukan mengarahkan ke halaman yang mengembalikan status **404**, atau diberi `noindex`, agar tidak jadi *soft 404*.

### 4.4 Checklist Teknis

- [ ] `<html lang="id">`, `meta viewport`, `meta charset`.
- [ ] HTTPS, satu versi domain (redirect `www` ↔ non-www), tanpa trailing-slash ganda.
- [ ] `robots.txt`: izinkan semua kecuali `/admin/`; cantumkan lokasi sitemap.
- [ ] `sitemap.xml` berisi semua URL yang ingin diindeks (+ `lastmod`), dikirim ke Search Console.
- [ ] Halaman admin: `noindex, nofollow`, tidak masuk sitemap.
- [ ] Canonical di setiap halaman (self-referencing). Halaman filter/parameter dikanonikalkan ke halaman utama.
- [ ] Open Graph + Twitter Card per halaman (gambar 1200×630).
- [ ] Favicon, halaman 404 kustom (status 404 sungguhan).
- [ ] Gambar: WebP, nama file deskriptif (`tumbler-custom-logo-hitam.webp`), `alt` deskriptif, `width`/`height`, lazy-load kecuali hero.
- [ ] Core Web Vitals: LCP < 2,5 dtk, CLS < 0,1, INP < 200 ms. Preload font utama dan gambar hero; batasi skrip pihak ketiga.
- [ ] Breadcrumb tampil dan ada markup `BreadcrumbList`.
- [ ] Firebase API key dibatasi domain; jangan sampai data sensitif ikut ke HTML publik.

---

## 5. Data Terstruktur (JSON-LD)

| Jenis | Halaman | Catatan |
|---|---|---|
| `Organization` / `LocalBusiness` | Beranda, Kontak | Nama, logo, alamat, telepon, jam buka, `sameAs` (Instagram, GBP, marketplace) |
| `WebSite` | Beranda | Nama situs |
| `BreadcrumbList` | Semua kecuali Beranda | Sesuai breadcrumb tampil |
| `Product` | Detail produk | Isi **hanya** bila ada data nyata (nama, gambar, deskripsi, dan `offers` bila harga ditampilkan). Jangan mengarang rating/ulasan |
| `Article` / `BlogPosting` | Artikel | Judul, penulis, `datePublished`, `dateModified`, gambar |
| `FAQPage` | Halaman dengan FAQ | Tetap berguna untuk memperjelas struktur, tetapi tampilan rich result FAQ di Google kini terbatas, jadi jangan dijadikan tujuan utama |

Contoh `LocalBusiness` (isi dengan data asli):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "[Brand]",
  "url": "https://[Domain]/",
  "logo": "https://[Domain]/assets/img/logo.png",
  "image": "https://[Domain]/assets/img/og-default.jpg",
  "telephone": "+6282232730246",
  "description": "Vendor souvenir kantor custom logo di [Kota].",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Alamat]",
    "addressLocality": "[Kota]",
    "addressRegion": "[Provinsi]",
    "postalCode": "[Kode Pos]",
    "addressCountry": "ID"
  },
  "openingHours": "Mo-Fr 08:00-17:00",
  "sameAs": ["https://www.instagram.com/[akun]"]
}
</script>
```

Validasi dengan **Rich Results Test** dan **Schema Markup Validator** setelah dipublikasikan.

---

## 6. Rencana Konten Blog

Prinsip: setiap artikel menjawab keputusan nyata pembeli, memuat data konkret (angka, bahan, waktu), ditulis/ditinjau orang yang benar-benar mengerjakan produk (E-E-A-T), dan **menaut ke 2–3 halaman produk yang relevan**.

### 6.1 Daftar Artikel Awal

| # | Judul Kerja | Keyword Utama | Maksud | Tautan ke |
|---|---|---|---|---|
| 1 | Panduan Memilih Souvenir Kantor untuk Karyawan, Klien, dan Acara (**pilar**) | souvenir kantor | Informasional | `/produk/` + semua kategori |
| 2 | 25 Ide Souvenir Seminar dan Pelatihan yang Benar-Benar Dipakai Peserta | souvenir seminar | Informasional | seminar kit, tumbler, notebook |
| 3 | Tumbler Custom Logo: Bahan, Teknik Cetak, dan Minimal Order | tumbler custom logo | Komersial | kategori tumbler |
| 4 | Sablon, Laser Engraving, Bordir, atau Emboss: Mana yang Cocok untuk Logo Anda? | teknik cetak logo souvenir | Informasional | produk terkait tiap teknik |
| 5 | Cara Menghitung Anggaran Souvenir Perusahaan per Orang | anggaran souvenir perusahaan | Informasional | `/produk/`, `/kontak/` |
| 6 | Hampers Korporat: Panduan dan Jadwal Order agar Tidak Terlambat | hampers korporat | Komersial | kategori hampers |
| 7 | Cara Pesan Souvenir Custom: dari Kirim Logo sampai Barang Sampai | cara pesan souvenir custom | Informasional | `/kontak/` |
| 8 | Souvenir Ulang Tahun Perusahaan: Ide dan Contoh | souvenir ulang tahun perusahaan | Informasional | galeri, produk |
| 9 | Hadiah untuk Karyawan: Ide Berdasarkan Budget | hadiah karyawan | Informasional | gift set, tumbler |
| 10 | Souvenir Kantor vs Merchandise Perusahaan: Apa Bedanya? | merchandise perusahaan | Informasional | `/produk/` |
| 11 | Isi Goodie Bag Event yang Berkesan | goodie bag event | Informasional | tote bag, pulpen |
| 12 | Studi Kasus: Souvenir untuk [Klien/Acara] | souvenir custom [jenis acara] | Bukti sosial | produk yang dipakai |

### 6.2 Struktur Artikel (Siap AEO/GEO)

1. Jawaban singkat 40–60 kata tepat di bawah `h1`.
2. Daftar isi dengan tautan anchor.
3. `h2` berupa pertanyaan atau topik nyata; paragraf pendek.
4. Tabel/daftar untuk perbandingan (mudah dikutip mesin pencari dan AI).
5. Contoh nyata, foto hasil kerja, angka (minimal order, durasi, kisaran biaya bila boleh dipublikasikan).
6. FAQ 3–5 pertanyaan di akhir.
7. Penulis (nama asli + peran), tanggal terbit, tanggal diperbarui.
8. Artikel terkait + CTA WhatsApp.

### 6.3 Kalender & Musiman

Konten musiman perlu terbit **2–3 bulan sebelum puncak permintaan** agar sempat terindeks.
- Hampers akhir tahun/Natal/Tahun Baru: untuk 2026 kemungkinan sudah terlambat bagi situs baru; siapkan halaman dan terbitkan lebih awal untuk tahun berikutnya, sambil tetap dipublikasikan sekarang agar mulai terindeks.
- **Hampers Lebaran 2027** (perkiraan awal Maret 2027): terbitkan paling lambat sekitar Desember 2026–Januari 2027.
- Pola lain yang perlu dipetakan dari data Anda: anggaran akhir tahun, HUT perusahaan, musim seminar/wisuda, HUT RI (Agustus).

Ritme: **2 artikel/bulan** sudah cukup bila kualitasnya tinggi. Perbarui artikel pilar tiap 3–6 bulan dan ubah `dateModified` hanya jika isinya benar-benar diperbarui.

---

## 7. SEO Lokal

1. **Google Business Profile** (GBP): klaim dan verifikasi. Pilih kategori utama yang paling sesuai dari daftar GBP (mis. pemasok barang promosi / toko souvenir), tambahkan kategori sekunder yang relevan.
2. Isi lengkap: nama usaha persis sama dengan di website, alamat, area layanan, jam, nomor 082232730246, tautan website, deskripsi, produk/layanan, foto asli (produk, workshop, hasil kerja, tim).
3. **NAP konsisten** (Nama, Alamat, Phone) di website, GBP, sosial media, marketplace, dan direktori.
4. **Ulasan:** minta ulasan dari klien setelah pesanan selesai (kirim tautan ulasan GBP lewat WhatsApp). Balas semua ulasan. Jangan membeli atau memalsukan ulasan.
5. **Posting GBP** 1–2 kali per bulan (portofolio baru, artikel, promo musiman).
6. Halaman Kontak: embed peta, alamat teks (bukan gambar), nomor yang bisa diklik, jam operasional.
7. Jika melayani banyak kota: buat halaman area layanan **hanya bila** ada isi unik yang bermanfaat (bukan salinan dengan nama kota diganti).

---

## 8. Otoritas & Tautan Masuk

Fokus pada tautan yang wajar dan relevan:
- Profil di marketplace dan direktori usaha/B2B dengan tautan ke website.
- Portofolio: minta izin klien untuk menampilkan nama/logo dan, bila bersedia, tautan balik dari situs mereka.
- Kolaborasi dengan EO, vendor percetakan, dan penyedia venue (tulisan tamu, daftar vendor rekanan).
- Pers lokal/komunitas bisnis, asosiasi UMKM/industri kreatif daerah.
- Konten yang layak dikutip: data survei kecil, template anggaran souvenir (unduhan gratis), checklist order.
- **Hindari:** membeli tautan, jaringan blog privat (PBN), komentar spam, dan pertukaran tautan massal.

---

## 9. AEO / GEO (Mesin Jawaban & AI)

- Tulis **jawaban langsung** di awal halaman, lalu detail.
- Gunakan **tabel spesifikasi** dan daftar bernomor; format ini mudah dipakai ulang oleh mesin jawaban.
- Sebutkan entitas secara konsisten: nama brand, kota, kategori usaha, produk, dan klien (bila diizinkan).
- Buat halaman **"Cara Order"** dan **FAQ** dengan pertanyaan asli dari chat WhatsApp pelanggan.
- Pastikan HTML berisi konten penuh (lihat bagian 4) karena crawler AI tidak selalu menjalankan JavaScript.
- Pantau apakah brand muncul saat Anda mengetik pertanyaan target di Google (AI Overviews) dan asisten AI; catat tiap bulan sebagai metrik kualitatif.

---

## 10. Penyesuaian yang Perlu Ditambahkan di Panel Admin

| Fitur Admin | Detail |
|---|---|
| Field SEO per produk | `slug`, `metaTitle`, `metaDescription`, `altGambar`, gambar OG |
| Field spesifikasi produk | bahan, ukuran, teknik cetak, minimal order, harga mulai, waktu produksi, FAQ produk |
| Field SEO per artikel | `slug`, `metaTitle`, `metaDescription`, `penulis`, `tanggalDiperbarui`, FAQ |
| Pratinjau SERP | Tampilan perkiraan title + URL + deskripsi, dengan penghitung karakter |
| Validasi slug | Unik, huruf kecil, tanpa spasi; slug lama menyimpan redirect saat diganti |
| Tombol **Publikasikan** | Memicu rebuild pre-render dan pembaruan sitemap |
| Pengaturan SEO global | Title default, deskripsi default, gambar OG default, data LocalBusiness |
| Kategori | Deskripsi kategori 80–150 kata (teks unik untuk halaman kategori) |

---

## 11. Pengukuran

### Alat
- **Google Search Console** (verifikasi domain, kirim sitemap, pantau cakupan dan kueri).
- **Google Analytics 4** dengan event: `klik_whatsapp`, `kirim_form_kontak`, `lihat_produk`, `klik_pesan_produk`.
- **Google Business Profile Insights** (panggilan, klik situs, rute).
- **PageSpeed Insights / CrUX** untuk Core Web Vitals.

### Indikator

| Kategori | Metrik |
|---|---|
| Visibilitas | Impresi, posisi rata-rata per cluster, jumlah halaman terindeks |
| Trafik | Klik organik, halaman masuk teratas |
| Konversi | Klik WhatsApp, pengiriman form, pesan masuk di admin |
| Lokal | Panggilan & permintaan rute GBP, jumlah dan rating ulasan |
| Teknis | Halaman error/dikecualikan di Search Console, LCP/CLS/INP |

Target angka (trafik, peringkat, jumlah leads) sebaiknya ditetapkan **setelah** punya data dasar dari Search Console dan volume Keyword Planner. SEO untuk situs baru umumnya butuh beberapa bulan sebelum hasilnya terlihat, dan tidak ada angka yang bisa dijanjikan.

---

## 12. Roadmap

### Hari 0–30: Fondasi
- Revisi PRD: halaman detail produk, kategori, URL blog bersih, field SEO di admin.
- Bangun template halaman + pre-render + sitemap + robots + canonical + JSON-LD dasar.
- Riset volume di Keyword Planner; finalkan peta keyword per URL.
- Verifikasi Search Console dan GA4; siapkan event konversi.
- Siapkan GBP.
- Isi halaman inti (Beranda, Tentang, Katalog, Kontak) dan **10–15 produk pertama** dengan data lengkap.

### Hari 31–60: Konten & Lokal
- Terbitkan artikel #1 (pilar), #3, #7, dan #2.
- Lengkapi halaman kategori dengan deskripsi unik.
- Kumpulkan portofolio klien (foto + izin tampil) untuk galeri dan studi kasus.
- Mulai meminta ulasan GBP; daftar di direktori dan marketplace dengan tautan ke website.

### Hari 61–90: Skala
- Terbitkan artikel #4, #5, #6 (hampers Lebaran), #9.
- Tinjau Search Console: kueri yang sudah muncul di posisi 8–20 → perkuat halamannya (tambah isi, tautan internal).
- Audit Core Web Vitals dan perbaiki.
- Mulai outreach tautan (EO, vendor rekanan, klien).

### Rutin Bulanan
- 2 artikel baru + 1 pembaruan artikel lama.
- Tambah produk/foto portofolio baru.
- Laporan: posisi per cluster, klik, konversi WhatsApp/form, ulasan baru.
- Perbaiki halaman yang turun posisi atau tidak terindeks.

---

## 13. Daftar Kesalahan yang Dihindari

- ❌ Menjejalkan keyword ("souvenir kantor murah souvenir kantor custom…") atau teks tersembunyi.
- ❌ Membuat puluhan halaman kota/produk dengan isi hampir sama.
- ❌ Mengarang harga, rating, ulasan, atau jumlah klien.
- ❌ Menyalin deskripsi dari marketplace atau pemasok.
- ❌ Menyembunyikan konten penting di balik tab/modal/klik tanpa URL sendiri.
- ❌ Menaruh seluruh navigasi sebagai tombol JS tanpa `<a href>`.
- ❌ Membeli tautan atau ulasan.
