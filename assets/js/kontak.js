/**
 * KONTAK.JS — Logika Halaman Kontak (kontak.html)
 * Mengatur form kontak, validasi, proteksi spam (honeypot & 60s cooldown), dan penyimpanan ke messages
 */

import { DataService } from './firebase-config.js';
import { showToast } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Muat Banner & Info Kontak
  loadContactInfo();

  // 2. Setup Form Submit
  setupContactForm();
});

async function loadContactInfo() {
  try {
    const [general, banners] = await Promise.all([
      DataService.getDocument('settings/general'),
      DataService.getDocument('settings/banners')
    ]);

    // Banner
    if (banners && banners.kontak) {
      const bTitle = document.getElementById('bannerTitle');
      const bDesc = document.getElementById('bannerDesc');
      if (bTitle && banners.kontak.judul) bTitle.textContent = banners.kontak.judul;
      if (bDesc && banners.kontak.deskripsi) bDesc.textContent = banners.kontak.deskripsi;
    }

    // Info Kontak
    if (general) {
      const addrEl = document.getElementById('contactAddress');
      const waEl = document.getElementById('contactWa');
      const emailEl = document.getElementById('contactEmail');
      const hoursEl = document.getElementById('contactHours');
      const mapWrap = document.getElementById('contactMapWrap');

      if (addrEl && general.alamat) addrEl.textContent = general.alamat;
      if (waEl && general.whatsapp) {
        waEl.textContent = general.whatsapp;
        waEl.href = `https://wa.me/${general.whatsapp.replace(/[^0-9]/g, '')}`;
      }
      if (emailEl && general.email) {
        emailEl.textContent = general.email;
        emailEl.href = `mailto:${general.email}`;
      }
      if (hoursEl && general.jamOperasional) hoursEl.textContent = general.jamOperasional;

      if (mapWrap && general.mapsEmbed) {
        if (general.mapsEmbed.startsWith('http')) {
          mapWrap.innerHTML = `<iframe src="${general.mapsEmbed}" width="100%" height="340" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;
        } else {
          mapWrap.innerHTML = general.mapsEmbed;
        }
      }
    }
  } catch (e) {
    console.warn("Contact info load error:", e);
  }
}

function setupContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('contactSubmitBtn');
  const alertBox = document.getElementById('contactAlertBox');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Cek Honeypot Spam Field
    const honeypot = document.getElementById('formWebsiteHoneypot');
    if (honeypot && honeypot.value.trim() !== '') {
      console.warn("Spam bot detected via honeypot.");
      return;
    }

    // 2. Cek Cooldown 60 Detik
    const lastSent = localStorage.getItem('kenes_last_contact_sent');
    if (lastSent) {
      const diffSeconds = (Date.now() - parseInt(lastSent, 10)) / 1000;
      if (diffSeconds < 60) {
        const remaining = Math.ceil(60 - diffSeconds);
        showAlert(`Mohon tunggu ${remaining} detik sebelum mengirim pesan berikutnya.`, 'warning');
        return;
      }
    }

    // 3. Ambil Nilai Form
    const nama = form.nama.value.trim();
    const email = form.email.value.trim();
    const telepon = form.telepon.value.trim();
    const subjek = form.subjek.value.trim() || 'Pertanyaan Kebutuhan Souvenir';
    const pesan = form.pesan.value.trim();

    // 4. Validasi Sisi Klien
    let hasError = false;
    clearFieldErrors();

    if (!nama) {
      setFieldError('nama', 'Silakan masukkan nama lengkap atau nama instansi Anda.');
      hasError = true;
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      setFieldError('email', 'Silakan masukkan alamat email yang valid.');
      hasError = true;
    }
    if (!telepon || telepon.length < 9) {
      setFieldError('telepon', 'Silakan masukkan nomor telepon / WhatsApp yang aktif.');
      hasError = true;
    }
    if (!pesan || pesan.length < 10) {
      setFieldError('pesan', 'Pesan minimal berisi 10 karakter.');
      hasError = true;
    }

    if (hasError) return;

    // 5. Kirim ke Database
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Mengirimkan Pesan...</span>';

    try {
      await DataService.addDocument('messages', {
        nama,
        email,
        telepon,
        subjek,
        pesan,
        isRead: false,
        createdAt: new Date().toISOString()
      });

      // Simpan timestamp cooldown
      localStorage.setItem('kenes_last_contact_sent', Date.now().toString());

      // Reset form
      form.reset();
      showAlert('Pesan Anda berhasil terkirim! Tim Kenes Souvenir akan segera menghubungi Anda melalui WhatsApp atau Email.', 'success');
      showToast('Pesan berhasil terkirim ke admin.', 'success');

    } catch (err) {
      console.error("Gagal mengirim pesan kontak:", err);
      showAlert('Maaf, terjadi kesalahan saat mengirimkan pesan. Silakan hubungi kami langsung via WhatsApp 082232730246.', 'danger');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

function setFieldError(fieldName, msg) {
  const field = document.querySelector(`[name="${fieldName}"]`);
  if (!field) return;
  const parent = field.closest('.form-group-custom') || field.parentElement;
  parent.classList.add('has-error');
  const errorEl = parent.querySelector('.form-error-msg');
  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
  }
}

function clearFieldErrors() {
  document.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
  document.querySelectorAll('.form-error-msg').forEach(el => el.style.display = 'none');
}

function showAlert(message, type = 'success') {
  const alertBox = document.getElementById('contactAlertBox');
  if (!alertBox) return;

  const bg = type === 'success' ? 'var(--cream-deep)' : 'rgba(217, 58, 0, 0.1)';
  const color = type === 'success' ? 'var(--ink)' : 'var(--orangered-700)';
  const border = type === 'success' ? 'var(--line)' : 'var(--orangered)';

  alertBox.style.cssText = `display:block;background:${bg};color:${color};border:1px solid ${border};padding:14px 18px;border-radius:2px;margin-bottom:1.5rem;font-size:0.9375rem;`;
  alertBox.textContent = message;
}

