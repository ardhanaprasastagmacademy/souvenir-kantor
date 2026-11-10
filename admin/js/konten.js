/**
 * KONTEN.JS — Kelola Konten Halaman Beranda, Tentang, dan Banner (admin/konten.html)
 */

import { DataService } from '../../assets/js/firebase-config.js';
import { showToast } from '../../assets/js/utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadPageContents();
  setupEventListeners();
});

async function loadPageContents() {
  try {
    const [home, about, banners] = await Promise.all([
      DataService.getDocument('settings/home'),
      DataService.getDocument('settings/about'),
      DataService.getDocument('settings/banners')
    ]);

    // 1. Beranda
    if (home) {
      if (home.hero) {
        document.getElementById('heroJudulInput').value = home.hero.judul || '';
        document.getElementById('heroSubjudulInput').value = home.hero.subjudul || '';
        document.getElementById('heroGambarUrlInput').value = home.hero.gambarUrl || '';
      }
      if (home.about) {
        document.getElementById('homeAboutJudulInput').value = home.about.judul || '';
        document.getElementById('homeAboutTeksInput').value = home.about.teks || '';
        document.getElementById('homeAboutGambarInput').value = home.about.gambarUrl || '';
      }
      if (home.cta) {
        document.getElementById('homeCtaJudulInput').value = home.cta.judul || '';
        document.getElementById('homeCtaTeksInput').value = home.cta.teks || '';
      }
    }

    // 2. Tentang
    if (about) {
      document.getElementById('aboutProfilInput').value = about.profil || '';
      document.getElementById('aboutVisiInput').value = about.visi || '';
      document.getElementById('aboutMisiInput').value = about.misi || '';
      document.getElementById('aboutGambarInput').value = about.gambarUrl || '';
    }

    // 3. Banners
    if (banners) {
      if (banners.produk) {
        document.getElementById('bannerProdukJudul').value = banners.produk.judul || '';
        document.getElementById('bannerProdukDesc').value = banners.produk.deskripsi || '';
      }
      if (banners.galeri) {
        document.getElementById('bannerGaleriJudul').value = banners.galeri.judul || '';
        document.getElementById('bannerGaleriDesc').value = banners.galeri.deskripsi || '';
      }
      if (banners.blog) {
        document.getElementById('bannerBlogJudul').value = banners.blog.judul || '';
        document.getElementById('bannerBlogDesc').value = banners.blog.deskripsi || '';
      }
      if (banners.kontak) {
        document.getElementById('bannerKontakJudul').value = banners.kontak.judul || '';
        document.getElementById('bannerKontakDesc').value = banners.kontak.deskripsi || '';
      }
    }
  } catch (err) {
    console.error("Gagal load konten halaman:", err);
  }
}

function setupEventListeners() {
  // Simpan Beranda
  document.getElementById('formKontenBeranda')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const current = await DataService.getDocument('settings/home') || {};
    const updated = {
      ...current,
      hero: {
        ...(current.hero || {}),
        judul: document.getElementById('heroJudulInput').value.trim(),
        subjudul: document.getElementById('heroSubjudulInput').value.trim(),
        gambarUrl: document.getElementById('heroGambarUrlInput').value.trim()
      },
      about: {
        ...(current.about || {}),
        judul: document.getElementById('homeAboutJudulInput').value.trim(),
        teks: document.getElementById('homeAboutTeksInput').value.trim(),
        gambarUrl: document.getElementById('homeAboutGambarInput').value.trim()
      },
      cta: {
        ...(current.cta || {}),
        judul: document.getElementById('homeCtaJudulInput').value.trim(),
        teks: document.getElementById('homeCtaTeksInput').value.trim()
      }
    };

    await DataService.updateDocument('settings/home', 'home', updated);
    showToast('Konten Beranda berhasil disimpan!', 'success');
  });

  // Simpan Tentang
  document.getElementById('formKontenTentang')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const current = await DataService.getDocument('settings/about') || {};
    const updated = {
      ...current,
      profil: document.getElementById('aboutProfilInput').value.trim(),
      visi: document.getElementById('aboutVisiInput').value.trim(),
      misi: document.getElementById('aboutMisiInput').value.trim(),
      gambarUrl: document.getElementById('aboutGambarInput').value.trim()
    };

    await DataService.updateDocument('settings/about', 'about', updated);
    showToast('Konten Halaman Tentang berhasil disimpan!', 'success');
  });

  // Simpan Banners
  document.getElementById('formKontenBanners')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const current = await DataService.getDocument('settings/banners') || {};
    const updated = {
      ...current,
      produk: {
        judul: document.getElementById('bannerProdukJudul').value.trim(),
        deskripsi: document.getElementById('bannerProdukDesc').value.trim()
      },
      galeri: {
        judul: document.getElementById('bannerGaleriJudul').value.trim(),
        deskripsi: document.getElementById('bannerGaleriDesc').value.trim()
      },
      blog: {
        judul: document.getElementById('bannerBlogJudul').value.trim(),
        deskripsi: document.getElementById('bannerBlogDesc').value.trim()
      },
      kontak: {
        judul: document.getElementById('bannerKontakJudul').value.trim(),
        deskripsi: document.getElementById('bannerKontakDesc').value.trim()
      }
    };

    await DataService.updateDocument('settings/banners', 'banners', updated);
    showToast('Page Banners berhasil disimpan!', 'success');
  });
}

