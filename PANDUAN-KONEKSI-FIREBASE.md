# Panduan Lengkap Koneksi Website ke Firebase

Panduan langkah demi langkah untuk menghubungkan website **Kenes Souvenir & Merchandise Kantor** ke layanan **Google Firebase** (Authentication, Cloud Firestore, Storage, dan Hosting).

---

## Ringkasan Layanan yang Digunakan

| Layanan Firebase | Fungsi pada Website Ini |
|---|---|
| **Firebase Authentication** | Login panel admin yang aman menggunakan Email & Password. |
| **Cloud Firestore** | Database NoSQL real-time untuk menyimpan produk, kategori, galeri, blog, testimoni, FAQ, pesan kontak, dan teks halaman. |
| **Firebase Storage** | Penyimpanan file gambar produk dan foto portofolio galeri yang diunggah admin. |
| **Firebase Hosting** *(Opsional)* | Hosting cepat berbasis CDN dengan SSL gratis untuk mendeploy website ke domain publik. |

---

## Langkah 1: Buat Proyek di Firebase Console

1. Buka [Firebase Console](https://console.firebase.google.com/) menggunakan akun Google Anda.
2. Klik tombol **"Add project"** (atau "Tambahkan project").
3. Masukkan nama project, misalnya: `souvenir-kantor` atau `kenes-souvenir`.
4. Pada opsi *Google Analytics*, Anda bisa memilih mengaktifkannya (disarankan) atau melewatinya, lalu klik **Create project**.
5. Tunggu proses pembuatan hingga selesai, lalu klik **Continue**.

---

## Langkah 2: Daftarkan Aplikasi Web (Web App)

1. Di halaman ikhtisar proyek (Project Overview), klik ikon **Web `</>`** untuk menambahkan aplikasi web.
2. Masukkan nama panggilan aplikasi (App nickname), misalnya: `Kenes Souvenir Web`.
3. Centang opsi *"Also set up Firebase Hosting for this app"* (opsional).
4. Klik **Register app**.
5. Firebase akan menampilkan objek konfigurasi `firebaseConfig`. Contohnya seperti ini:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD-xxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "souvenir-kantor-xxxxx.firebaseapp.com",
  projectId: "souvenir-kantor-xxxxx",
  storageBucket: "souvenir-kantor-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxxxxxx"
};
```

> **Simpan atau biarkan halaman ini terbuka**, nilai-nilai ini akan dimasukkan ke website di Langkah 6.

---

## Langkah 3: Aktifkan Firebase Authentication (Login Admin)

1. Di menu sidebar kiri Firebase Console, klik **Build** → **Authentication**.
2. Klik tombol **Get started**.
3. Di tab **Sign-in method**, pilih penyedia **Email/Password**.
4. Aktifkan toggle **Email/Password** (opsi *Email link (passwordless)* biarkan nonaktif), lalu klik **Save**.
5. Buka tab **Users**, klik tombol **Add user**:
   - Masukkan Email admin Anda (misalnya: `admin@kenessouvenir.com`).
   - Masukkan Password yang kuat (minimal 6 karakter).
   - Klik **Add user**.
6. **PENTING:** Salin nilai **User UID** dari akun yang baru dibuat (deretan huruf dan angka unik). UID ini diperlukan di Langkah 5.

---

## Langkah 4: Aktifkan Cloud Firestore (Database)

1. Di menu sidebar kiri, klik **Build** → **Firestore Database**.
2. Klik tombol **Create database**.
3. Pilih lokasi database (disarankan **asia-southeast2 (Jakarta)** untuk latensi terendah di Indonesia).
4. Pilih mode keamanan:
   - Pilih **Start in test mode** untuk mempermudah sinkronisasi data awal pertama kali.
   - Klik **Enable**.

---

## Langkah 5: Terapkan Aturan Keamanan (Firestore Rules)

File aturan keamanan resmi telah disiapkan di repositori proyek Anda pada file `firestore.rules`.

1. Di halaman **Firestore Database**, buka tab **Rules**.
2. Ganti seluruh isi aturan dengan kode dari file `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    function isAdmin() {
      return request.auth != null &&
             exists(/databases/$(db)/documents/admins/$(request.auth.uid));
    }

    match /products/{id} {
      allow read:  if resource.data.isActive == true || isAdmin();
      allow write: if isAdmin();
    }

    match /categories/{id} {
      allow read:  if true;
      allow write: if isAdmin();
    }

    match /gallery/{id} {
      allow read:  if resource.data.isActive == true || isAdmin();
      allow write: if isAdmin();
    }

    match /testimonials/{id} {
      allow read:  if resource.data.isActive == true || isAdmin();
      allow write: if isAdmin();
    }

    match /faqs/{id} {
      allow read:  if resource.data.isActive == true || isAdmin();
      allow write: if isAdmin();
    }

    match /posts/{id} {
      allow read:  if resource.data.status == 'published' || isAdmin();
      allow write: if isAdmin();
    }

    match /settings/{doc} {
      allow read:  if true;
      allow write: if isAdmin();
    }

    match /messages/{id} {
      allow create: if request.resource.data.keys().hasOnly(
                        ['nama', 'email', 'telepon', 'subjek', 'pesan', 'isRead', 'createdAt'])
                    && request.resource.data.nama is string   && request.resource.data.nama.size() <= 100
                    && request.resource.data.email is string  && request.resource.data.email.size() <= 150
                    && request.resource.data.pesan is string  && request.resource.data.pesan.size() <= 3000
                    && request.resource.data.isRead == false;
      allow read, update, delete: if isAdmin();
    }

    match /admins/{uid} {
      allow read:  if request.auth != null && request.auth.uid == uid;
      allow write: if false;
    }
  }
}
```

3. Klik **Publish**.
4. **Daftarkan UID Admin ke Firestore:**
   - Masuk ke tab **Data** di Firestore Database.
   - Klik **Start collection**.
   - Nama koleksi: `admins`.
   - Document ID: tempelkan **User UID** admin yang Anda salin dari Langkah 3 (bukan email).
   - Buat field:
     - Field: `email` | Type: `string` | Value: email admin Anda.
     - Field: `createdAt` | Type: `string` | Value: tanggal hari ini.
   - Klik **Save**.
   *(Langkah ini membuat aturan `isAdmin()` mengizinkan akun Anda mengelola seluruh data).*

---

## Langkah 6: Aktifkan Firebase Storage (Penyimpanan Foto)

1. Di menu sidebar kiri, klik **Build** → **Storage**.
2. Klik tombol **Get started**.
3. Pilih **Start in test mode**, klik **Next**.
4. Pilih lokasi penyimpanan (gunakan lokasi yang sama dengan Firestore, misal `asia-southeast2`), klik **Done**.
5. Buka tab **Rules** di Storage, pasang aturan dari `storage.rules`:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAdmin() {
      return request.auth != null;
    }

    match /{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin()
                   && request.resource.size < 2 * 1024 * 1024
                   && request.resource.contentType.matches('image/(jpeg|png|webp|svg\\+xml)');
      allow delete: if isAdmin();
    }
  }
}
```
6. Klik **Publish**.

---

## Langkah 7: Masukkan Konfigurasi ke Website

Anda memiliki **2 cara mudah** untuk memasukkan konfigurasi:

### Cara A: Melalui Panel Admin (Paling Praktis Tanpa Edit Kode)
1. Buka website di browser dan masuk ke panel admin:
   `http://localhost:3000/admin/login.html`
2. Masuk menggunakan akun admin demo:
   - **Email:** `admin@kenessouvenir.com`
   - **Password:** `admin123`
3. Masuk ke menu **Pengaturan Website** (`admin/pengaturan.html`).
4. Gulir ke bagian **"Integrasi Firebase"**.
5. Salin dan tempel:
   - `apiKey`
   - `projectId`
   - `authDomain`
   - `storageBucket`
   - `appId`
6. Klik tombol **"Simpan Kredensial Firebase"**. Website akan otomatis memuat ulang dan beralih ke database cloud Firebase!

---

### Cara B: Langsung Edit File `assets/js/firebase-config.js`
Buka file `assets/js/firebase-config.js` pada baris 22–29, dan isi objek konfigurasi Anda:

```javascript
export const FIREBASE_CONFIG = savedConfig ? JSON.parse(savedConfig) : (window.FIREBASE_CONFIG || {
  apiKey: "AIzaSyD-xxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "souvenir-kantor-xxxxx.firebaseapp.com",
  projectId: "souvenir-kantor-xxxxx",
  storageBucket: "souvenir-kantor-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxxxxxx"
});
```

---

## Langkah 8: Unggah Data Awal (Seed Data) ke Firestore dalam 1 Klik

Agar database Firestore Anda tidak kosong melompong:
1. Buka halaman admin **Pengaturan Website** (`admin/pengaturan.html`).
2. Pada bagian Firebase, klik tombol:
   **"⬆ Unggah & Sinkronkan Data Awal ke Cloud Firestore"**.
3. Dalam hitungan detik, sistem akan secara otomatis mengisi Cloud Firestore Anda dengan:
   - 8 Produk souvenir kantor lengkap dengan spesifikasi teknis dan FAQ.
   - 6 Kategori produk (Tumbler, Agenda Kulit, Seminar Kit, Tote Bag, dll).
   - 6 Dokumentasi portofolio galeri.
   - 3 Artikel blog pilar siap SEO.
   - Testimoni B2B rekanan instansi resmi.
   - FAQ tanya jawab pemesanan.
   - Pengaturan teks dan banner beranda.

---

## Langkah 9: Deploy ke Firebase Hosting (Publikasi Online)

Untuk mengonlinekan website Anda dengan domain `https://<project-id>.web.app`:

1. Buka terminal PowerShell di folder proyek Anda:
   ```powershell
   cd "c:\PROJECT\souvenir kantor"
   ```
2. Pastikan Firebase CLI terpasang (jika belum, pasang via npm):
   ```powershell
   npm install -g firebase-tools
   ```
3. Login ke akun Google Anda:
   ```powershell
   firebase login
   ```
4. Hubungkan proyek lokal ke proyek Firebase:
   ```powershell
   firebase use --add
   ```
   *(Pilih project id yang Anda buat di Langkah 1)*.
5. Jalankan perintah deploy untuk mendeploy website, aturan Firestore, dan aturan Storage sekaligus:
   ```powershell
   firebase deploy
   ```
6. Selesai! Firebase akan memberikan URL publik website Anda (misal `https://souvenir-kantor.web.app`) yang siap diakses klien di seluruh dunia dengan SSL HTTPS aktif.

---

## Bantuan & Verifikasi

- **Verifikasi Koneksi:** Buka Developer Tools (F12) → tab **Console** di browser. Jika berhasil terhubung, akan muncul pesan:
  `Firebase berhasil terhubung: <project-id>`
- **Test Kirim Pesan:** Coba kirim pesan melalui halaman `kontak.html`. Buka Firestore Console → koleksi `messages` dan periksa apakah pesan baru langsung muncul secara real-time.
- **Login Admin dengan Akun Firebase:** Setelah Firebase Auth terhubung, Anda dapat login di `admin/login.html` menggunakan email dan password yang Anda buat di Langkah 3.

