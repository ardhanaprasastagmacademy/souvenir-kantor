/**
 * PENGATURAN.JS — Pengaturan Website & Konfigurasi (admin/pengaturan.html)
 */

import { DataService, initLocalDatabase, FIREBASE_CONFIG } from '../../assets/js/firebase-config.js';
import { showToast } from '../../assets/js/utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadGeneralSettings();
  setupEventListeners();
});

async function loadGeneralSettings() {
  try {
    const general = await DataService.getDocument('settings/general');
    if (!general) return;

    document.getElementById('setNamaBisnis').value = general.namaBisnis || '';
    document.getElementById('setTagline').value = general.tagline || '';
    document.getElementById('setWhatsapp').value = general.whatsapp || '082232730246';
    document.getElementById('setWaPesanAwal').value = general.waPesanAwal || '';
    document.getElementById('setEmail').value = general.email || '';
    document.getElementById('setAlamat').value = general.alamat || '';
    document.getElementById('setJamOperasional').value = general.jamOperasional || '';
    document.getElementById('setMapsEmbed').value = general.mapsEmbed || '';

    // Sosmed
    const sos = general.sosial || {};
    document.getElementById('setInstagram').value = sos.instagram || '';
    document.getElementById('setFacebook').value = sos.facebook || '';
    document.getElementById('setTiktok').value = sos.tiktok || '';

    // SEO Default
    document.getElementById('setSeoTitle').value = general.seoTitle || '';
    document.getElementById('setSeoDesc').value = general.seoDesc || '';
    document.getElementById('setOgImage').value = general.ogImage || '';

    // Firebase Config aktif
    const activeFc = savedFirebase ? JSON.parse(savedFirebase) : FIREBASE_CONFIG;
    if (activeFc) {
      document.getElementById('fbApiKey').value = activeFc.apiKey || '';
      document.getElementById('fbAuthDomain').value = activeFc.authDomain || '';
      document.getElementById('fbProjectId').value = activeFc.projectId || '';
      document.getElementById('fbStorageBucket').value = activeFc.storageBucket || '';
      document.getElementById('fbAppId').value = activeFc.appId || '';
    }
  } catch (err) {
    console.error("Gagal load pengaturan:", err);
  }
}

function setupEventListeners() {
  // Simpan Pengaturan Umum
  document.getElementById('formPengaturanGeneral')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      namaBisnis: document.getElementById('setNamaBisnis').value.trim(),
      tagline: document.getElementById('setTagline').value.trim(),
      whatsapp: document.getElementById('setWhatsapp').value.trim(),
      waPesanAwal: document.getElementById('setWaPesanAwal').value.trim(),
      email: document.getElementById('setEmail').value.trim(),
      alamat: document.getElementById('setAlamat').value.trim(),
      jamOperasional: document.getElementById('setJamOperasional').value.trim(),
      mapsEmbed: document.getElementById('setMapsEmbed').value.trim(),
      sosial: {
        instagram: document.getElementById('setInstagram').value.trim(),
        facebook: document.getElementById('setFacebook').value.trim(),
        tiktok: document.getElementById('setTiktok').value.trim()
      },
      seoTitle: document.getElementById('setSeoTitle').value.trim(),
      seoDesc: document.getElementById('setSeoDesc').value.trim(),
      ogImage: document.getElementById('setOgImage').value.trim()
    };

    try {
      await DataService.updateDocument('settings/general', 'general', payload);
      showToast('Pengaturan website berhasil diperbarui!', 'success');
    } catch (err) {
      console.error("Gagal update settings:", err);
      alert("Gagal menyimpan pengaturan.");
    }
  });

  // Auto-parse snippet Firebase Config
  document.getElementById('btnAutoParseConfig')?.addEventListener('click', () => {
    const text = document.getElementById('fbSnippetInput')?.value || '';
    if (!text.trim()) {
      alert('Silakan tempelkan kode firebaseConfig terlebih dahulu ke dalam kotak.');
      return;
    }

    const matchApiKey = text.match(/apiKey:\s*["']([^"']+)["']/i);
    const matchAuthDomain = text.match(/authDomain:\s*["']([^"']+)["']/i);
    const matchProjectId = text.match(/projectId:\s*["']([^"']+)["']/i);
    const matchStorageBucket = text.match(/storageBucket:\s*["']([^"']+)["']/i);
    const matchAppId = text.match(/appId:\s*["']([^"']+)["']/i);

    let count = 0;
    if (matchApiKey) { document.getElementById('fbApiKey').value = matchApiKey[1]; count++; }
    if (matchAuthDomain) { document.getElementById('fbAuthDomain').value = matchAuthDomain[1]; count++; }
    if (matchProjectId) { document.getElementById('fbProjectId').value = matchProjectId[1]; count++; }
    if (matchStorageBucket) { document.getElementById('fbStorageBucket').value = matchStorageBucket[1]; count++; }
    if (matchAppId) { document.getElementById('fbAppId').value = matchAppId[1]; count++; }

    if (count > 0) {
      showToast(`${count} kredensial Firebase berhasil diekstrak! Jangan lupa klik 'Simpan Kredensial Firebase'.`, 'success');
    } else {
      alert('Format kode tidak dikenali. Pastikan Anda menempelkan objek konfigurasi firebaseConfig.');
    }
  });

  // Simpan Konfigurasi Firebase
  document.getElementById('formFirebaseConfig')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const config = {
      apiKey: document.getElementById('fbApiKey').value.trim(),
      authDomain: document.getElementById('fbAuthDomain').value.trim(),
      projectId: document.getElementById('fbProjectId').value.trim(),
      storageBucket: document.getElementById('fbStorageBucket').value.trim(),
      appId: document.getElementById('fbAppId').value.trim()
    };

    localStorage.setItem('kenes_firebase_config', JSON.stringify(config));
    showToast('Kredensial Firebase tersimpan! Memuat ulang konfigurasi...', 'success');
    setTimeout(() => window.location.reload(), 1200);
  });

  // Sinkronisasi data awal ke Cloud Firestore
  document.getElementById('btnSyncSeedToFirestore')?.addEventListener('click', async (e) => {
    const btn = e.target;
    btn.disabled = true;
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Sedang mengunggah data ke Firestore...';

    try {
      await DataService.syncSeedDataToFirestore();
      showToast('Seluruh data awal (Produk, Kategori, Galeri, Postingan) berhasil diunggah ke Cloud Firestore!', 'success');
    } catch (err) {
      console.error("Gagal sinkron data ke Firestore:", err);
      alert(err.message || "Gagal mengunggah ke Firestore. Pastikan Firestore rules mengizinkan penulisan.");
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  });

  // Reset Data Awal / Seed Data
  document.getElementById('btnResetSeedData')?.addEventListener('click', () => {
    if (confirm("PERINGATAN: Tindakan ini akan memuat ulang seluruh data contoh (produk, artikel, galeri, testimoni, FAQ) ke data awal resmi Kenes Souvenir. Lanjutkan?")) {
      initLocalDatabase(true);
      showToast('Data awal (Seed Data) berhasil dimuat ulang!', 'success');
      setTimeout(() => window.location.reload(), 1000);
    }
  });
}

