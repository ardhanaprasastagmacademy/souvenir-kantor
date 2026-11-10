# DESIGN — Website Souvenir Kantor

Pelengkap `PRD.md`. Dokumen ini menjadi acuan visual untuk seluruh halaman publik dan panel admin.
**Stack:** Bootstrap 5.3 · CSS kustom (CSS variables) · Vanilla JS.

---

## 1. Arah Visual

**Kata kunci:** premium · elegan · hangat · tenang · editorial.

Kesan yang dituju adalah butik merchandise korporat, bukan template startup. Orangered dipakai sebagai warna tanda (signature) yang tegas, dan cream memberi ruang bernapas yang hangat. Kemewahan datang dari **proporsi, ruang kosong, tipografi, dan detail kecil**, bukan dari efek yang ramai.

### Prinsip
1. **Sedikit elemen, dikerjakan rapi.** Whitespace besar, grid tegas, hierarki jelas.
2. **Tipografi sebagai dekorasi.** Judul serif kontras tinggi, angka besar, label kecil berspasi lebar.
3. **Garis tipis, bukan bayangan.** Pemisah memakai hairline 1px; bayangan nyaris tidak dipakai.
4. **Sudut tegas.** Radius kecil (2–4px) agar terasa presisi dan mahal.
5. **Foto produk adalah bintangnya.** UI mundur, produk maju.

---

## 2. Warna

### 2.1 Token

| Token | Hex | Pemakaian |
|---|---|---|
| `--orangered` | `#FF4500` | Warna tanda murni: garis aksen, angka besar, penanda, ornamen. Tidak untuk latar teks kecil |
| `--orangered-600` | `#D93A00` | **Orangered untuk UI**: latar navbar, tombol utama, sidebar mobile, strip CTA |
| `--orangered-700` | `#B83000` | Hover/pressed tombol utama |
| `--cream` | `#FBF4E8` | Latar halaman utama |
| `--cream-soft` | `#FEFAF3` | Kartu, input, panel (lebih terang dari latar) |
| `--cream-deep` | `#F2E7D3` | Section selang-seling, page banner, placeholder gambar |
| `--ink` | `#231B16` | Teks utama, footer, section gelap |
| `--muted` | `#6E6258` | Teks sekunder, deskripsi, breadcrumb |
| `--line` | `#E4D6BE` | Hairline, border kartu/input |
| `--on-orangered` | `#FFFBF3` | Teks di atas orangered |

> **Mengapa ada dua orangered?** Putih di atas `#FF4500` hanya sekitar **3,4 : 1**, di bawah batas keterbacaan teks normal (4,5 : 1). `#D93A00` tetap terbaca sebagai orangered, tetapi kontrasnya sekitar **4,6 : 1**. Jadi navbar dan tombol memakai `--orangered-600`, sedangkan `#FF4500` murni dipakai untuk aksen yang bukan teks kecil. Verifikasi ulang dengan alat cek kontras sebelum rilis. Jika ingin navbar `#FF4500` murni, teks navbar sebaiknya minimal 18,66px bold.

### 2.2 CSS Variables

```css
:root {
  --orangered:      #FF4500;
  --orangered-600:  #D93A00;
  --orangered-700:  #B83000;

  --cream:          #FBF4E8;
  --cream-soft:     #FEFAF3;
  --cream-deep:     #F2E7D3;

  --ink:            #231B16;
  --muted:          #6E6258;
  --line:           #E4D6BE;
  --on-orangered:   #FFFBF3;

  --radius:         2px;
  --radius-lg:      4px;
  --ease:           cubic-bezier(.22, .61, .36, 1);

  /* Hubungkan ke Bootstrap 5.3 */
  --bs-body-bg:     var(--cream);
  --bs-body-color:  var(--ink);
  --bs-border-color: var(--line);
  --bs-link-color:  var(--orangered-600);
  --bs-link-hover-color: var(--orangered-700);
}
```

### 2.3 Ritme Warna per Section

| Area | Latar | Teks |
|---|---|---|
| Navbar | `--orangered-600` | `--on-orangered` |
| Hero | `--cream` | `--ink` |
| Tentang | `--cream-soft` | `--ink` |
| Kenapa Pilih Kami | `--cream-deep` | `--ink` |
| Produk | `--cream` | `--ink` |
| Galeri | `--cream-soft` | `--ink` |
| Testimoni | `--ink` | `--cream` |
| FAQ | `--cream` | `--ink` |
| CTA | `--orangered-600` | `--on-orangered` |
| Page banner | `--cream-deep` | `--ink` |
| Footer | `--ink` | `--cream` |

Aturan: jangan menaruh dua section berwarna sama berurutan; orangered penuh hanya di **navbar dan CTA** agar tetap istimewa.

---

## 3. Tipografi

| Peran | Font | Fallback |
|---|---|---|
| Judul (display) | **Bodoni Moda** | `"Didot", "Georgia", serif` |
| Isi & UI | **Hanken Grotesk** | `system-ui, -apple-system, "Segoe UI", sans-serif` |

Dipilih agar tidak jatuh ke kombinasi bawaan yang sudah terlalu umum (Inter, Poppins, Playfair). Bodoni Moda sangat kontras sehingga **hanya dipakai di ukuran ≥ 28px**.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500;6..96,600&family=Hanken+Grotesk:wght@400..700&display=swap" rel="stylesheet">
```

### Skala

| Elemen | Ukuran | Berat | Line-height | Catatan |
|---|---|---|---|---|
| H1 | `clamp(2.5rem, 5.5vw, 4.5rem)` | 500 | 1.05 | letter-spacing −0.01em, Bodoni Moda |
| H2 | `clamp(2rem, 3.6vw, 3rem)` | 500 | 1.12 | Bodoni Moda |
| H3 | `1.5rem` | 500 | 1.25 | Bodoni Moda |
| Eyebrow (label atas judul) | `0.75rem` | 600 | 1.4 | HURUF KAPITAL, tracking `0.14em`, warna `--orangered-600` |
| Isi | `1rem` (17px di ≥ 1200px) | 400 | 1.7 | Hanken Grotesk, warna `--ink` |
| Isi sekunder | `0.9375rem` | 400 | 1.65 | warna `--muted` |
| Tombol & nav | `0.9375rem` | 500–600 | 1 | tracking `0.02em` |

Lebar baris isi maksimal ~65 karakter (`max-width: 38rem`).

---

## 4. Ikon (Anti-Template)

Ikon yang sering muncul di website buatan AI **tidak dipakai**: roket, bohlam, perisai centang, lingkaran centang, percikan/sparkles, piala, jabat tangan, petir, bintang rating berderet, dan kotak ikon bergradasi.

**Gantinya:**
- **Section "Kenapa Pilih Kami" & "Keunggulan":** tanpa ikon. Gunakan **angka besar serif** (`01`, `02`, `03`) berwarna `--orangered`, judul, lalu deskripsi, dipisah garis atas 1px.
- **Pemisah/ornamen:** garis tipis, titik kecil, atau tanda kurung siku ketik (`[ 01 ]`).
- **Rating testimoni:** tidak ditampilkan sebagai bintang. Cukup kutipan, nama, dan perusahaan.
- **Daftar poin:** penanda berupa garis pendek 12px (`—`) berwarna orangered, bukan centang.
- **Ikon yang tetap dibutuhkan** (WhatsApp, Instagram, panah, hamburger, tutup) memakai **SVG inline kustom**: stroke 1.5px, ujung `square`, tanpa isian, tanpa lingkaran latar. Jangan memuat pustaka ikon penuh (Font Awesome / Bootstrap Icons) agar tampilannya tidak generik dan lebih ringan.

### Ikon yang dipakai

```html
<!-- Panah (back to top) -->
<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
     stroke-width="1.5" stroke-linecap="square" aria-hidden="true">
  <path d="M12 20V5M5.5 11.5 12 5l6.5 6.5"/>
</svg>

<!-- Tutup sidebar -->
<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
     stroke-width="1.5" stroke-linecap="square" aria-hidden="true">
  <path d="M5 5l14 14M19 5 5 19"/>
</svg>
```
Glyph WhatsApp dan Instagram: gunakan versi monokrom satu warna (`currentColor`).

---

## 5. Navbar

### 5.1 Desktop (≥ 992px)
- Latar **`--orangered-600`**, tinggi 76px, `position: sticky; top: 0`. Saat scroll > 40px tinggi menyusut ke 64px (tanpa bayangan; cukup `border-bottom: 1px solid rgba(0,0,0,.12)`).
- Kiri: logo/wordmark (versi cream/putih). Kanan: menu Beranda · Tentang · Produk · Galeri · Blog · Kontak, lalu tombol **Hubungi Kami**.
- **Efek teks menu: hanya menjadi bold.** Tanpa garis bawah, tanpa pil/latar, tanpa perubahan warna, tanpa geser.
  - Normal: weight **500**. Hover dan halaman aktif: weight **700**.
  - Transisi `font-weight .2s`. Hanken Grotesk adalah variable font, sehingga perubahan berat tampak halus.
- **Mencegah layout bergeser** saat teks menebal: reservasi lebar versi bold dengan pseudo-element.

```html
<a class="nav-link-x" href="produk.html" data-text="Produk">Produk</a>
```
```css
.site-header { background: var(--orangered-600); position: sticky; top: 0; z-index: 1030; }

.nav-link-x {
  display: inline-flex; flex-direction: column; align-items: center;
  color: var(--on-orangered); font-size: .9375rem; letter-spacing: .02em;
  font-weight: 500; text-decoration: none;
  transition: font-weight .2s var(--ease);
}
.nav-link-x::after {               /* menahan lebar versi bold */
  content: attr(data-text); font-weight: 700;
  height: 0; overflow: hidden; visibility: hidden; pointer-events: none;
}
.nav-link-x:hover,
.nav-link-x.active { font-weight: 700; color: var(--on-orangered); }
.nav-link-x:focus-visible { outline: 2px solid var(--on-orangered); outline-offset: 6px; }
```

- Tombol **Hubungi Kami** di navbar: latar `--cream`, teks `--ink`, tanpa border, radius 2px; hover latar `--cream-deep`.

### 5.2 Mobile (< 992px) — Sidebar

- Bar atas tetap orangered: logo di kiri, tombol menu di kanan.
- **Tombol menu: dua garis** (garis atas 26px, bawah 18px, rata kanan), bukan tiga garis standar.
- Klik membuka **sidebar dari kanan** (komponen `offcanvas offcanvas-end` Bootstrap).

| Properti | Nilai |
|---|---|
| Lebar | `min(86vw, 340px)` |
| Latar | `--orangered-600` |
| Overlay | `rgba(35, 27, 22, .55)` |
| Animasi | geser dari kanan, 320ms `--ease` |
| Header | wordmark di kiri, ikon tutup (X tipis) di kanan |
| Menu | satu kolom, font **Bodoni Moda 28px**, warna `--on-orangered`, padding vertikal 16px, dipisah hairline `rgba(255,251,243,.25)` |
| Efek menu | sama dengan desktop: hover/aktif **menjadi bold** (700) saja |
| Bagian bawah | nomor **082232730246**, alamat singkat, tombol "Chat WhatsApp" (latar `--cream`, teks `--ink`) |

```html
<div class="offcanvas offcanvas-end sidebar-menu" tabindex="-1" id="menuSamping"
     aria-labelledby="judulMenu">
  <div class="offcanvas-header">…wordmark + tombol tutup…</div>
  <div class="offcanvas-body">
    <ul class="sidebar-list">
      <li><a class="nav-link-x" data-text="Beranda" href="index.html">Beranda</a></li>
      …
    </ul>
    <div class="sidebar-kontak">…</div>
  </div>
</div>
```
```css
.sidebar-menu { background: var(--orangered-600); color: var(--on-orangered);
                width: min(86vw, 340px); border-left: 0; }
.sidebar-list { list-style: none; padding: 0; margin: 0; }
.sidebar-list li { border-bottom: 1px solid rgba(255,251,243,.25); }
.sidebar-list .nav-link-x { font-family: "Bodoni Moda", serif; font-size: 1.75rem;
                            padding: 16px 0; align-items: flex-start; }
```
Perilaku: sidebar menutup saat tautan diklik, saat menekan `Esc`, atau saat overlay diklik; scroll halaman terkunci selama terbuka; fokus terjebak di dalam sidebar (bawaan Bootstrap).

---

## 6. Komponen

### 6.1 Tombol
| Varian | Gaya |
|---|---|
| Utama | latar `--orangered-600`, teks `--on-orangered`, radius 2px, padding `14px 28px`, weight 600, tracking `.04em`. Hover: `--orangered-700`. Tanpa bayangan |
| Sekunder | transparan, border 1px `--ink`, teks `--ink`. Hover: latar `--ink`, teks `--cream` |
| Tautan teks | teks `--ink` weight 600 dengan garis bawah 1px `--orangered`; hover garis bawah memanjang dari kiri (`background-size` 0→100%, 300ms) |

Dua tombol berdampingan di hero **tidak dibuat sama bobotnya**: satu utama, satu tautan teks.

### 6.2 Page Banner + Breadcrumb
- Latar `--cream-deep`, padding `88px 0 64px`, garis bawah 1px `--line`.
- Eyebrow kecil, judul H1 serif besar rata kiri, deskripsi satu kalimat `--muted`.
- Breadcrumb di atas judul: huruf kecil berspasi, pemisah `/` tipis, halaman aktif `--muted` bold. Tidak memakai ikon rumah.
- Latar foto opsional: lapisan `--ink` 55% di atas foto, teks krem.

### 6.3 Kartu Produk
- Tanpa bayangan, tanpa border radius besar. Gambar rasio **4:5**, latar `--cream-deep` sebagai placeholder, `object-fit: cover`.
- Di bawah gambar: kategori (eyebrow), nama produk (Bodoni Moda 22px), kisaran harga (`--muted`, opsional).
- Dua aksi berupa tautan teks: **Detail** dan **Pesan via WhatsApp**.
- Hover: gambar membesar halus (`scale(1.03)`, 600ms), garis atas kartu berubah ke `--orangered`.
- Filter kategori: tab teks berjajar, yang aktif bold dengan garis bawah orangered 2px (bukan pil berwarna).

### 6.4 Galeri
Grid rapat gap 12px, rasio campuran (4:5 dan 1:1) bergantian, atau rata 1:1 jika data seragam. Hover: caption muncul dari bawah di atas lapisan `--ink` 70%, teks krem. Lightbox berlatar `--ink` 94%, tombol navigasi berupa panah tipis.

### 6.5 Testimoni
Latar `--ink`. Satu kutipan besar per slide (Bodoni Moda italic, `clamp(1.5rem, 3vw, 2.25rem)`), garis orangered pendek (48px) di atasnya, lalu nama (bold) dan perusahaan (`--muted` terang). Navigasi: nomor `01 / 05` dan dua panah tipis. Tanpa tanda kutip dekoratif raksasa dan tanpa foto bulat bawaan.

### 6.5 FAQ (Accordion)
Tanpa kartu. Setiap item dipisah hairline atas `--line`. Pertanyaan: Bodoni Moda 20px. Penanda buka/tutup berupa karakter `+` dan `−` tipis di kanan (menggantikan chevron Bootstrap). Jawaban `--muted`, `max-width: 38rem`.

### 6.6 Form Kontak
- Input latar `--cream-soft`, border 1px `--line`, radius 2px, tinggi 52px. Label di atas, huruf kecil berspasi.
- Fokus: border `--ink` + `outline: 2px solid var(--orangered); outline-offset: 2px`. Tanpa glow biru bawaan Bootstrap.
- Pesan error: teks `--orangered-700` di bawah field, tanpa ikon seru.

### 6.7 Section "Kenapa Pilih Kami" / Keunggulan
Grid 3 kolom. Setiap item: garis atas 1px `--ink`, angka `01` (Bodoni Moda 48px, `--orangered`), judul (H3), deskripsi. Tidak ada kartu berbayangan.

### 6.8 CTA
Latar `--orangered-600`, padding 96px. Judul serif krem rata kiri (kolom 7 dari 12), tombol krem di kanan. Tidak ada ilustrasi dan tidak ada gradasi.

### 6.9 Footer
Latar `--ink`. Wordmark besar, empat kolom (deskripsi, tautan cepat, kontak, jam kerja), hairline `rgba(251,244,232,.15)`. Judul kolom berupa eyebrow orangered `#FF4500` (cukup kontras di atas ink dan berukuran besar/bold). Baris hak cipta di bagian paling bawah.

### 6.10 WhatsApp Pop Up & Back to Top
| Elemen | Gaya |
|---|---|
| Tombol WhatsApp | bulat 56px, latar `--ink`, glyph WhatsApp krem, `right: 20px; bottom: 20px` |
| Pop up WhatsApp | kartu `--cream-soft`, border 1px `--line`, radius 4px, header strip `--orangered-600` berisi nama bisnis, teks sapaan, tombol utama "Chat WhatsApp" → `https://wa.me/6282232730246`. Muncul dengan fade + naik 8px |
| Back to Top | persegi/bulat 48px, latar `--cream`, border 1px `--ink`, **ikon panah ke atas** tipis (SVG pada bagian 4). Hover: latar `--orangered-600`, panah krem. `right: 20px; bottom: 88px`, muncul setelah scroll > 300px |

Kedua tombol tidak saling menutupi di layar 360px.

---

## 7. Layout & Spasi

| Hal | Nilai |
|---|---|
| Container | maks. 1200px, padding sisi 24px (mobile 20px) |
| Grid | 12 kolom Bootstrap, gutter 32px (mobile 16px) |
| Satuan spasi | kelipatan 8px |
| Padding section | 112px desktop · 80px tablet · 64px mobile |
| Breakpoint | 576 · 768 · 992 · 1200 · 1400 (bawaan Bootstrap) |

**Komposisi (anti-tengah-semua):** hero dua kolom asimetris (teks 6 kolom, gambar 6 kolom dengan sedikit offset ke bawah), section tentang memakai gambar yang menjorok keluar kolom, judul section rata kiri dengan eyebrow, hindari susunan "judul tengah + 3 kartu tengah" di setiap section.

---

## 8. Gambar

- Foto produk: latar netral hangat (krem/abu hangat), pencahayaan lembut, sudut konsisten. Hindari foto stok generik (jabat tangan, rapat, orang tertawa menghadap laptop).
- Rasio tetap per konteks (hero 4:5, produk 4:5, galeri 1:1 / 4:5, artikel 16:10) agar tidak ada layout shift.
- Format WebP, `loading="lazy"` (kecuali gambar hero), atribut `width`/`height` diisi, `alt` deskriptif.
- Tanpa filter, tanpa frame, tanpa watermark besar.

---

## 9. Gerak (Motion)

- Durasi 200–600ms, easing `--ease`. Gerak hanya berfungsi memberi umpan balik atau memperhalus kemunculan.
- Kemunculan saat scroll: fade + naik 16px, sekali saja, **hanya untuk konten statis**. Untuk konten yang dimuat dari Firebase (produk, galeri, blog, testimoni, FAQ), jangan beri kelas animasi pada elemen yang baru disisipkan lewat JS; gunakan skeleton lalu tampilkan langsung, atau picu animasi setelah elemen dirender.
- Hindari parallax, kursor kustom, partikel, dan animasi berulang tanpa henti.
- Hormati `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
```

Skeleton loading: blok `--cream-deep` dengan kilau sangat tipis (bukan abu-abu biru bawaan).

---

## 10. Gaya Penulisan (Copy)

Bahasa Indonesia, lugas, hangat, formal secukupnya. Sebutkan hal yang konkret (bahan, jumlah minimal, teknik cetak, lama pengerjaan) alih-alih klaim kosong.

| Hindari | Gunakan |
|---|---|
| "Solusi terbaik untuk kebutuhan Anda" | "Tumbler, tote bag, dan notebook dengan logo perusahaan, mulai 50 pcs" |
| "Kami hadir untuk mewujudkan…" | "Kirim logo Anda, kami kirim mockup dalam 1 hari kerja" |
| "Terpercaya, profesional, berkualitas" | "Sudah mengerjakan souvenir untuk [jumlah] acara perusahaan" *(isi dengan data nyata)* |
| Tanda seru berlebihan, emoji | Kalimat pendek dan tenang |

Testimoni memakai nama dan perusahaan asli.

---

## 11. Panel Admin

Tampilan admin mengikuti bahasa yang sama, tetapi lebih fungsional.
- Latar halaman `--cream-soft`, sidebar kiri `--ink` dengan teks krem; menu aktif bold dengan garis orangered 2px di kiri.
- Tabel: header eyebrow, baris dipisah hairline, tanpa zebra mencolok, aksi berupa tautan teks.
- Tombol utama sama (`--orangered-600`); tindakan hapus memakai teks `--orangered-700` dan konfirmasi modal.
- Kartu statistik dashboard: angka besar Bodoni Moda, label eyebrow, tanpa ikon dan tanpa warna-warni.
- Di mobile, sidebar admin juga berupa offcanvas dari kiri.

---

## 12. Aksesibilitas

- Kontras teks minimal 4,5 : 1 (lihat catatan bagian 2.1).
- Fokus terlihat di semua elemen interaktif: outline 2px, `offset` 3px; di atas orangered gunakan outline krem.
- Area sentuh minimal 44 × 44px (tombol menu, tutup, WhatsApp, back to top).
- Tombol ikon wajib memiliki `aria-label` ("Buka menu", "Tutup menu", "Kembali ke atas", "Chat WhatsApp").
- Struktur heading berurutan, satu `h1` per halaman.

---

## 13. Daftar Larangan (Anti AI-Slop)

- ❌ Gradasi ungu/biru, gradasi pada teks, atau blob/orb latar.
- ❌ Glassmorphism, blur kartu, neon glow.
- ❌ Kartu serba membulat besar (`rounded-3xl`) dengan bayangan lembut di mana-mana.
- ❌ Kotak ikon berwarna di atas setiap fitur; ikon roket, bohlam, perisai, sparkles, piala, jabat tangan.
- ❌ Hero "judul tengah + dua tombol tengah + tiga statistik" yang generik.
- ❌ Bintang rating berderet, lencana "No.1", penghitung angka berjalan tanpa data nyata.
- ❌ Emoji di antarmuka, copy klise, dan foto stok generik.
- ❌ Font Inter/Poppins/Roboto sebagai tampilan utama.
- ✅ Garis tipis, angka serif, ruang kosong luas, foto produk yang kuat, dan satu warna tanda yang konsisten.
