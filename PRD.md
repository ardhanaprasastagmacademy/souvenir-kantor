# PRD — Website Souvenir Kantor

**Versi:** 1.0
**Stack:** Bootstrap 5 · HTML · CSS · Vanilla JavaScript · Firebase (Authentication, Firestore, Storage)
**Kontak bisnis (WhatsApp):** 082232730246 → tautan `https://wa.me/6282232730246`

---

## 1. Ringkasan Produk

Website company profile + katalog untuk bisnis **souvenir kantor** (merchandise perusahaan, hampers, seminar kit, dan sejenisnya). Website terdiri dari halaman publik yang kontennya **dinamis dari Firebase Firestore** dan **panel admin** untuk mengelola seluruh konten tanpa menyentuh kode.

### Tujuan
1. Menampilkan profil usaha dan katalog produk secara profesional.
2. Memudahkan calon pelanggan menghubungi bisnis lewat form kontak dan WhatsApp.
3. Memberi admin kendali penuh atas produk, galeri, blog, testimoni, FAQ, pesan masuk, dan informasi website.
4. Ringan, cepat dimuat, dan ramah mobile.

### Di Luar Cakupan (v1.0)
- Keranjang belanja dan pembayaran online (pemesanan dilakukan via WhatsApp).
- Akun pelanggan / login pengunjung.
- Multi-bahasa.
- Multi-admin dengan hak akses berbeda (v1.0 hanya satu peran: admin).

---

## 2. Pengguna

| Peran | Deskripsi | Kebutuhan Utama |
|---|---|---|
| **Pengunjung** | Calon pelanggan (HRD, panitia acara, procurement, instansi) | Lihat produk, lihat portofolio, baca artikel, hubungi via form/WA |
| **Admin** | Pemilik/pengelola website | Login aman, kelola semua konten, baca pesan masuk |

---

## 3. Sitemap

### Halaman Publik
| Halaman | File | Dinamis dari Firebase |
|---|---|---|
| Beranda | `index.html` | Ya (produk, galeri, testimoni, FAQ, teks hero/tentang/keunggulan) |
| Tentang | `tentang.html` | Ya (teks tentang & keunggulan) |
| Produk | `produk.html` | Ya (daftar produk + kategori) |
| Galeri | `galeri.html` | Ya (foto galeri) |
| Blog | `blog.html` | Ya (daftar artikel) |
| Detail Blog | `blog-detail.html?slug=...` | Ya (satu artikel) — *tambahan, dibutuhkan agar artikel bisa dibaca* |
| Kontak | `kontak.html` | Ya (info kontak + form menyimpan ke Firestore) |
| 404 | `404.html` | Tidak |

### Halaman Admin (`/admin/`)
| Halaman | File |
|---|---|
| Login | `admin/login.html` |
| Dashboard | `admin/index.html` |
| Kelola Produk | `admin/produk.html` |
| Kelola Kategori Produk | `admin/kategori.html` |
| Kelola Galeri | `admin/galeri.html` |
| Kelola Blog | `admin/blog.html` |
| Kelola Testimoni | `admin/testimoni.html` |
| Kelola FAQ | `admin/faq.html` |
| Pesan Masuk | `admin/pesan.html` |
| Konten Halaman (Beranda & Tentang) | `admin/konten.html` |
| Pengaturan Website | `admin/pengaturan.html` |

---

## 4. Komponen Global (Semua Halaman Publik)

### 4.1 Navbar
- Logo + menu: Beranda, Tentang, Produk, Galeri, Blog, Kontak.
- Sticky di atas, collapse menjadi hamburger di mobile.
- Menu aktif diberi penanda sesuai halaman.
- Tombol CTA kecil "Hubungi Kami" (ke WhatsApp).

### 4.2 Page Banner + Breadcrumb
Dipakai di semua halaman **kecuali Beranda**.
- **Page banner:** judul halaman + deskripsi singkat, dengan background gambar/warna.
- **Breadcrumb:** `Beranda / Nama Halaman` (untuk detail blog: `Beranda / Blog / Judul Artikel`). Menggunakan komponen breadcrumb Bootstrap dan markup JSON-LD `BreadcrumbList`.

### 4.3 Footer
Logo + deskripsi singkat, tautan cepat, kontak (alamat, telepon, email), jam operasional, ikon sosial media, hak cipta. Semua data diambil dari `settings/general`.

### 4.4 WhatsApp Pop Up (Floating)
- Tombol bulat hijau ikon WhatsApp, posisi **kanan bawah**, fixed.
- Klik → membuka kotak pop up kecil berisi sapaan ("Halo, ada yang bisa kami bantu?"), nama admin/bisnis, dan tombol **"Chat WhatsApp"**.
- Tombol mengarah ke `https://wa.me/6282232730246?text=...` dengan pesan awal terisi otomatis (teks bisa diatur dari admin).
- Bisa ditutup; tidak menutupi tombol Back to Top (posisi vertikal berbeda).

### 4.5 Tombol Back to the Top
- Tombol bulat dengan **ikon panah ke atas**, posisi kanan bawah **di atas** tombol WhatsApp.
- Muncul setelah scroll > 300px (fade in/out), klik → scroll halus ke atas.

### 4.6 Skeleton / Loading State
Saat data Firestore dimuat, tampilkan skeleton placeholder agar layout tidak melompat. Jika gagal memuat, tampilkan pesan error dengan tombol "Coba lagi".

---

## 5. Spesifikasi Halaman Publik

### 5.1 Beranda (`index.html`)

| # | Section | Isi | Sumber Data |
|---|---|---|---|
| 1 | **Hero** | Judul besar, subjudul, 2 tombol (Lihat Produk, Hubungi via WA), gambar utama | `settings/home.hero` |
| 2 | **Tentang** | Gambar + teks ringkas + tombol "Selengkapnya" → `tentang.html` | `settings/home.about` |
| 3 | **Kenapa Pilih Kami** | 3–6 kartu (ikon, judul, deskripsi) | `settings/home.whyUs[]` |
| 4 | **Produk** | 6–8 produk unggulan (`isFeatured = true`), tombol "Lihat Semua Produk" | `products` |
| 5 | **Galeri** | 6–8 foto terbaru, tombol "Lihat Galeri" | `gallery` |
| 6 | **Testimoni** | Carousel/slider: nama, perusahaan, rating, isi | `testimonials` |
| 7 | **FAQ** | Accordion Bootstrap | `faqs` |
| 8 | **CTA** | Ajakan konsultasi + tombol WhatsApp | `settings/home.cta` |

### 5.2 Tentang (`tentang.html`)
1. Page Banner
2. Breadcrumb
3. **Section Tentang** — teks panjang + gambar (profil usaha, visi, misi)
4. **Section Keunggulan** — kartu keunggulan (data `settings/about.advantages[]`)
5. **CTA**

### 5.3 Produk (`produk.html`)
1. Page Banner
2. Breadcrumb
3. **Section Produk (dinamis, diatur admin)**
   - Grid kartu produk: gambar, nama, kategori, deskripsi singkat, kisaran harga (opsional), tombol **"Detail"** dan **"Pesan via WA"**.
   - Filter kategori (pill/tab) dan kolom pencarian.
   - Klik "Detail" membuka **modal** berisi foto, deskripsi lengkap, dan tombol pesan (tanpa halaman detail terpisah, agar ringan).
   - Tombol "Pesan via WA" membuat pesan otomatis: *"Halo, saya tertarik dengan produk [Nama Produk]."*
   - Pagination atau tombol "Muat lebih banyak" (12 item per muatan).
4. **CTA**

### 5.3 Galeri (`galeri.html`)
1. Page Banner
2. Breadcrumb
3. **Section Galeri (dinamis, dikelola admin)** — grid masonry/rata, opsional filter kategori, klik foto membuka **lightbox** (next/prev, caption). Lazy loading pada gambar.

### 5.4 Blog (`blog.html`)
1. Page Banner
2. Breadcrumb
3. **Section Blog (dinamis, diatur admin)** — kartu artikel (thumbnail, judul, ringkasan, tanggal, penulis, "Baca selengkapnya"), hanya artikel berstatus `published`, urut terbaru, pagination.

### 5.5 Detail Blog (`blog-detail.html?slug=...`)
Breadcrumb 3 tingkat, judul, penulis, tanggal terbit, gambar utama, isi artikel (HTML yang disanitasi), tombol bagikan, dan 3 artikel terkait. Jika slug tidak ditemukan → tampilkan state "Artikel tidak ditemukan".

### 5.6 Kontak (`kontak.html`)
1. Page Banner
2. Breadcrumb
3. **Form Kontak** — field: Nama*, Email*, No. Telepon/WA*, Subjek, Pesan*. Di sebelahnya: info kontak (alamat, **082232730246**, email, jam operasional) dan peta (Google Maps embed, diatur admin).
   - Validasi sisi klien (Bootstrap validation) + aturan Firestore sisi server.
   - Submit → tersimpan ke koleksi `messages` → tampil di **halaman Pesan Masuk admin** dan hitungan di **dashboard**.
   - Setelah sukses: tampilkan notifikasi sukses & reset form. Tombol submit dinonaktifkan selama proses.
   - Proteksi spam: honeypot field + batas pengiriman (cooldown 60 detik via localStorage) dan opsi Firebase App Check.

---

## 6. Spesifikasi Panel Admin

### 6.1 Autentikasi
- Login dengan **Firebase Authentication (Email/Password)**.
- Hanya UID yang terdaftar di koleksi `admins` yang boleh mengakses halaman admin dan menulis data.
- Semua halaman admin memeriksa status login; jika belum login → redirect ke `admin/login.html`.
- Fitur: logout, lupa password (email reset), sesi otomatis berakhir saat logout.
- Halaman admin ditandai `noindex` dan tidak dimasukkan ke sitemap.

### 6.2 Layout Admin
Sidebar menu (collapse di mobile) + topbar (nama admin, tombol logout). Setiap halaman kelola memakai pola yang sama: **tabel data + tombol Tambah + modal form + konfirmasi hapus**.

### 6.3 Dashboard (`admin/index.html`)
- Kartu statistik: total produk, total foto galeri, total artikel (publish/draft), jumlah pesan **belum dibaca**.
- Daftar 5 pesan terbaru (klik → buka detail di halaman Pesan).
- Pintasan cepat: Tambah Produk, Tulis Artikel, Unggah Foto, Lihat Website.

### 6.4 Kelola Produk
- Tabel: gambar, nama, kategori, status, unggulan, aksi.
- CRUD: nama, slug otomatis, kategori, deskripsi singkat, deskripsi lengkap, kisaran harga (opsional), unggah gambar utama, status aktif/nonaktif, tandai **unggulan** (tampil di beranda), urutan tampil.
- Pencarian dan filter kategori.

### 6.5 Kelola Kategori Produk
CRUD nama kategori + slug. Kategori yang masih dipakai produk tidak bisa dihapus (tampilkan peringatan).

### 6.6 Kelola Galeri
- Unggah satu/banyak foto sekaligus, isi judul/caption, kategori (opsional), urutan, status.
- Hapus foto juga menghapus file di Storage.

### 6.7 Kelola Blog
- Tabel artikel: judul, status (draft/published), tanggal, aksi.
- Form: judul, slug otomatis (bisa diedit), ringkasan, thumbnail, **editor rich text** (Quill), penulis, status, tanggal terbit, meta title & meta description.
- Konten disanitasi dengan DOMPurify sebelum ditampilkan.

### 6.8 Kelola Testimoni
CRUD: nama, perusahaan/jabatan, isi, rating (1–5), foto (opsional), status tampil.

### 6.9 Kelola FAQ
CRUD pertanyaan & jawaban, urutan (drag atau input angka), status tampil.

### 6.10 Pesan Masuk
- Daftar pesan dari form kontak: nama, subjek, tanggal, status (baru / sudah dibaca).
- Detail pesan dalam modal; otomatis ditandai dibaca saat dibuka.
- Aksi: tandai dibaca/belum, hapus, tombol cepat **"Balas via WhatsApp"** dan **"Balas via Email"**.
- Filter: semua / belum dibaca; pencarian.

### 6.11 Konten Halaman
Form untuk mengubah teks dan gambar:
- **Beranda:** hero, tentang singkat, daftar "Kenapa Pilih Kami", teks CTA.
- **Tentang:** teks tentang, visi/misi, daftar keunggulan, teks CTA.
- **Page banner** tiap halaman (judul, deskripsi, gambar).

### 6.12 Pengaturan Website
Nama bisnis, tagline, logo, favicon, nomor WhatsApp (default `082232730246`), pesan awal WhatsApp, email, alamat, jam operasional, tautan sosial media, embed Google Maps, SEO default (title, description, gambar Open Graph), ganti password admin.

---

## 7. Model Data (Firestore)

```
admins/{uid}                  → { email, createdAt }

settings/general              → { namaBisnis, tagline, logoUrl, faviconUrl, whatsapp, waPesanAwal,
                                  email, alamat, jamOperasional, sosial:{instagram,facebook,tiktok,youtube},
                                  mapsEmbed, seoTitle, seoDesc, ogImage }
settings/home                 → { hero:{judul,subjudul,gambarUrl,ctaText1,ctaText2},
                                  about:{judul,teks,gambarUrl},
                                  whyUs:[{ikon,judul,deskripsi}],
                                  cta:{judul,teks,tombol} }
settings/about                → { judul, teks, visi, misi, gambarUrl,
                                  advantages:[{ikon,judul,deskripsi}], cta:{...} }
settings/banners              → { produk:{judul,deskripsi,gambarUrl}, galeri:{...}, blog:{...},
                                  kontak:{...}, tentang:{...} }

categories/{id}               → { nama, slug, urutan }
products/{id}                 → { nama, slug, kategoriId, kategoriNama, deskripsiSingkat, deskripsi,
                                  hargaMulai, gambarUrl, gambarPath, isFeatured, isActive, urutan,
                                  createdAt, updatedAt }
gallery/{id}                  → { judul, kategori, gambarUrl, gambarPath, urutan, isActive, createdAt }
posts/{id}                    → { judul, slug, ringkasan, konten, thumbnailUrl, thumbnailPath, penulis,
                                  status, tanggalTerbit, metaTitle, metaDesc, createdAt, updatedAt }
testimonials/{id}             → { nama, perusahaan, isi, rating, fotoUrl, isActive, createdAt }
faqs/{id}                     → { pertanyaan, jawaban, urutan, isActive }
messages/{id}                 → { nama, email, telepon, subjek, pesan, isRead, createdAt }
```

**Indeks yang dibutuhkan:** `products` (isActive + urutan), `posts` (status + tanggalTerbit desc), `gallery` (isActive + urutan), `messages` (createdAt desc).

---

## 8. Keamanan

### 8.1 Firestore Rules (garis besar)

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    function isAdmin() {
      return request.auth != null &&
             exists(/databases/$(db)/documents/admins/$(request.auth.uid));
    }

    // Konten publik: semua orang boleh baca, hanya admin boleh tulis
    match /{col}/{id} {
      allow read:  if col in ['products','categories','gallery','testimonials','faqs']
                      && resource.data.get('isActive', true) == true;
      allow write: if isAdmin() && col in ['products','categories','gallery','testimonials','faqs'];
    }
    match /posts/{id} {
      allow read:  if resource.data.status == 'published' || isAdmin();
      allow write: if isAdmin();
    }
    match /settings/{doc} {
      allow read:  if true;
      allow write: if isAdmin();
    }

    // Pesan: pengunjung hanya boleh membuat (dengan validasi), admin boleh baca/ubah/hapus
    match /messages/{id} {
      allow create: if request.resource.data.keys().hasOnly(
                        ['nama','email','telepon','subjek','pesan','isRead','createdAt'])
                    && request.resource.data.nama is string   && request.resource.data.nama.size()   <= 100
                    && request.resource.data.email is string  && request.resource.data.email.size()  <= 150
                    && request.resource.data.pesan is string  && request.resource.data.pesan.size()  <= 2000
                    && request.resource.data.isRead == false;
      allow read, update, delete: if isAdmin();
    }

    match /admins/{uid} { allow read: if request.auth.uid == uid; allow write: if false; }
  }
}
```

> Aturan ini adalah garis besar; finalisasi dan uji di Firebase Emulator sebelum rilis. Catatan: query publik harus menyertakan filter `isActive == true` agar sesuai rules.

### 8.2 Storage Rules
- Baca: publik. Tulis/hapus: hanya admin.
- Batas ukuran file 2 MB, tipe `image/jpeg|png|webp`.

### 8.3 Praktik Lain
- Kunci API Firebase tidak rahasia, tetapi **batasi domain** di Google Cloud Console dan aktifkan **App Check**.
- Seluruh teks dari database ditampilkan dengan `textContent` atau disanitasi (DOMPurify) untuk mencegah XSS.
- Admin pertama dibuat manual di Firebase Console (tanpa halaman registrasi publik).

---

## 9. SEO & Performa

Karena konten diambil dari Firestore lewat JavaScript, SEO perlu perhatian khusus:

- **Meta dinamis:** `title`, `meta description`, canonical, dan Open Graph di `blog-detail.html` diisi lewat JS dari data artikel.
- **JSON-LD:** `Organization`/`LocalBusiness` (beranda), `BreadcrumbList`, `Article` (detail blog), `FAQPage` (FAQ di beranda), `Product` (opsional).
- **Sitemap.xml** dan **robots.txt** (blokir `/admin/`). Karena artikel dinamis, sitemap artikel dibuat manual atau lewat skrip build sederhana.
- Struktur heading semantik (satu `h1` per halaman), atribut `alt` pada semua gambar.
- **Keterbatasan yang perlu disadari:** halaman yang dirender di sisi klien lebih lambat terindeks dibanding HTML statis. Mitigasi: konten pokok (hero, tentang, teks halaman) ditulis juga langsung di HTML sebagai fallback, dan data dinamis dimuat cepat dengan cache.
- **Performa:** gambar WebP + `loading="lazy"` + ukuran eksplisit (cegah CLS), kompres saat unggah (maks. lebar 1600 px), cache data ringan di `sessionStorage`, `defer` pada script, Bootstrap dan Font hanya yang dipakai, target **PageSpeed ≥ 90 (mobile)**.

---

## 10. Persyaratan Non-Fungsional

| Aspek | Target |
|---|---|
| Responsif | Mobile-first, teruji di 360px, 768px, 1366px |
| Browser | Chrome, Edge, Firefox, Safari (2 versi terakhir) |
| Aksesibilitas | Kontras warna memadai, `aria-label` pada tombol ikon, navigasi keyboard |
| Waktu muat | LCP < 2,5 dtk pada jaringan 4G |
| Keandalan | Semua halaman memiliki state loading, kosong, dan error |
| Bahasa | Seluruh antarmuka publik dan admin dalam **Bahasa Indonesia** |

---

## 11. Struktur Folder

```
/
├── index.html
├── tentang.html
├── produk.html
├── galeri.html
├── blog.html
├── blog-detail.html
├── kontak.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── css/
│   │   ├── style.css            (token warna, komponen kustom)
│   │   └── admin.css
│   ├── js/
│   │   ├── firebase-config.js   (inisialisasi Firebase)
│   │   ├── main.js              (navbar, back to top, WA pop up, helper)
│   │   ├── home.js  produk.js  galeri.js  blog.js  blog-detail.js  kontak.js
│   │   └── utils.js             (format tanggal, slugify, sanitasi, WA link)
│   └── img/
└── admin/
    ├── login.html  index.html  produk.html  kategori.html  galeri.html
    ├── blog.html  testimoni.html  faq.html  pesan.html  konten.html  pengaturan.html
    └── js/
        ├── auth-guard.js
        ├── admin-layout.js
        └── produk.js  kategori.js  galeri.js  blog.js  testimoni.js  faq.js  pesan.js  konten.js  pengaturan.js
```

Firebase SDK memakai **versi modular (v10+)** dan diimpor sebagai ES module.

---

## 12. Alur Utama

1. **Pengunjung → Pesan produk:** Produk → klik "Pesan via WA" → WhatsApp terbuka dengan pesan otomatis ke 082232730246.
2. **Pengunjung → Form kontak:** isi form → validasi → simpan ke `messages` → notifikasi sukses.
3. **Admin → Pesan baru:** pesan masuk → angka "belum dibaca" di dashboard & sidebar bertambah → admin membuka & membalas.
4. **Admin → Tambah produk:** Kelola Produk → Tambah → unggah gambar → simpan → langsung tampil di `produk.html`.
5. **Admin → Terbitkan artikel:** Kelola Blog → tulis → status `published` → tampil di `blog.html`.

---

## 13. Kriteria Penerimaan (Acceptance Criteria)

- [ ] Semua halaman publik sesuai susunan section pada bagian 5; Beranda tanpa page banner/breadcrumb, halaman lain memilikinya.
- [ ] Produk, galeri, blog, testimoni, FAQ tampil dari Firestore dan berubah setelah admin mengedit tanpa mengubah kode.
- [ ] Form kontak menyimpan pesan ke Firestore dan pesan muncul di halaman admin serta hitungan dashboard.
- [ ] Tombol WhatsApp pop up dan Back to Top (ikon panah) tampil di semua halaman publik, tidak saling menutupi, dan berfungsi di mobile.
- [ ] Nomor WhatsApp 082232730246 dipakai konsisten (footer, kontak, CTA, pop up, tombol pesan produk).
- [ ] Halaman admin tidak dapat diakses tanpa login; pengunjung tidak dapat menulis/mengubah data selain mengirim pesan.
- [ ] Upload gambar berfungsi; hapus data juga menghapus file di Storage.
- [ ] Skor PageSpeed mobile ≥ 90 pada Beranda dan Produk.
- [ ] Tampilan benar di layar 360px hingga desktop.

---

## 14. Tahapan Pengembangan

| Fase | Pekerjaan |
|---|---|
| **1. Fondasi** | Setup Firebase project (Auth, Firestore, Storage), `firebase-config.js`, token desain CSS, komponen global (navbar, footer, banner, WA pop up, Back to Top) |
| **2. Admin inti** | Login + guard, layout admin, pengaturan website, kategori, produk |
| **3. Halaman publik inti** | Beranda, Produk, Tentang (terhubung Firestore) |
| **4. Konten tambahan** | Galeri, Blog + detail blog + editor, testimoni, FAQ |
| **5. Kontak & pesan** | Form kontak, halaman Pesan Masuk, dashboard |
| **6. Finalisasi** | Security rules, SEO & JSON-LD, optimasi performa, uji lintas perangkat, deploy (Firebase Hosting atau Vercel) |

---

## 15. Asumsi & Keputusan Terbuka

1. **Firebase Storage** saat ini memerlukan paket **Blaze** (bayar sesuai pemakaian; kuota gratis cukup besar untuk situs kecil). Jika ingin tetap gratis, alternatifnya unggah gambar ke **Cloudinary** (unsigned preset) dan simpan URL-nya di Firestore.
2. Detail produk memakai **modal**, bukan halaman terpisah. Jika ingin SEO per produk, ubah menjadi `produk-detail.html?slug=...`.
3. Harga produk bersifat **opsional/kisaran**; bila bisnis tidak menampilkan harga, field dikosongkan dan tombol WA menjadi CTA utama.
4. Notifikasi email untuk pesan baru tidak termasuk v1.0 (butuh Cloud Functions/Blaze); admin cukup melihat di dashboard.
5. Arah desain (warna, tipografi, logo) belum ditentukan dan akan dibuat terpisah dalam `DESIGN.md`.
