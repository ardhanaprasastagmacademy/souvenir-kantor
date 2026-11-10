/**
 * GALERI.JS — Logika Halaman Galeri Portofolio (galeri.html)
 * Menampilkan grid portofolio hasil produksi souvenir dengan lightbox kustom
 */

import { DataService } from './firebase-config.js';

let allGalleryItems = [];
let filteredGallery = [];
let activeCategory = 'all';
let currentLightboxIndex = 0;

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Muat Banner
  loadBannerData();

  // 2. Muat Galeri Data
  await loadGallery();

  // 3. Setup Lightbox
  setupLightbox();
});

async function loadBannerData() {
  try {
    const banners = await DataService.getDocument('settings/banners');
    if (banners && banners.galeri) {
      const titleEl = document.getElementById('bannerTitle');
      const descEl = document.getElementById('bannerDesc');
      if (titleEl && banners.galeri.judul) titleEl.textContent = banners.galeri.judul;
      if (descEl && banners.galeri.deskripsi) descEl.textContent = banners.galeri.deskripsi;
    }
  } catch (e) {
    console.warn("Banner error:", e);
  }
}

async function loadGallery() {
  const container = document.getElementById('galleryGridContainer');
  const filterContainer = document.getElementById('galleryFilterContainer');
  if (!container) return;

  try {
    const items = await DataService.getCollection('gallery');
    allGalleryItems = items.filter(g => g.isActive).sort((a, b) => (a.urutan || 0) - (b.urutan || 0));

    // Ekstrak kategori unik
    if (filterContainer) {
      const categories = ['all', ...new Set(allGalleryItems.map(i => i.kategori).filter(Boolean))];
      filterContainer.innerHTML = categories.map(cat => `
        <button type="button" class="filter-tab-btn ${activeCategory === cat ? 'active' : ''}" data-category="${cat}">
          ${cat === 'all' ? 'Semua Portofolio' : cat}
        </button>
      `).join('');

      filterContainer.querySelectorAll('.filter-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          filterContainer.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          activeCategory = btn.getAttribute('data-category');
          renderGalleryGrid();
        });
      });
    }

    renderGalleryGrid();
  } catch (err) {
    console.error("Gagal memuat galeri:", err);
    container.innerHTML = `<div class="col-12 text-center py-5 text-danger">Gagal memuat galeri portofolio.</div>`;
  }
}

function renderGalleryGrid() {
  const container = document.getElementById('galleryGridContainer');
  if (!container) return;

  filteredGallery = activeCategory === 'all' 
    ? allGalleryItems 
    : allGalleryItems.filter(i => i.kategori === activeCategory);

  if (filteredGallery.length === 0) {
    container.innerHTML = `<div class="text-center py-5 text-muted-custom w-100">Belum ada dokumentasi untuk kategori ini.</div>`;
    return;
  }

  container.innerHTML = filteredGallery.map((item, idx) => `
    <div class="gallery-item ${idx % 3 === 0 ? 'tall' : ''}" data-index="${idx}">
      <img src="${item.gambarUrl}" alt="${item.judul}" loading="lazy" width="400" height="400">
      <div class="gallery-caption-overlay">
        <div class="gallery-caption-category">${item.kategori || 'Portofolio'}</div>
        <div class="gallery-caption-title">${item.judul}</div>
      </div>
    </div>
  `).join('');

  // Click triggers lightbox
  container.querySelectorAll('.gallery-item').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.getAttribute('data-index'), 10);
      openLightbox(idx);
    });
  });
}

function setupLightbox() {
  const lightbox = document.getElementById('galleryLightbox');
  const lbClose = document.getElementById('lightboxClose');
  const lbPrev = document.getElementById('lightboxPrev');
  const lbNext = document.getElementById('lightboxNext');

  if (!lightbox) return;

  if (lbClose) lbClose.addEventListener('click', () => lightbox.classList.remove('active'));
  if (lbPrev) lbPrev.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(-1); });
  if (lbNext) lbNext.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(1); });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('active');
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') lightbox.classList.remove('active');
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

function openLightbox(index) {
  const lightbox = document.getElementById('galleryLightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCaption = document.getElementById('lightboxCaption');
  if (!lightbox || !filteredGallery[index]) return;

  currentLightboxIndex = index;
  const item = filteredGallery[index];
  lbImg.src = item.gambarUrl;
  lbCaption.textContent = item.judul;
  lightbox.classList.add('active');
}

function navigateLightbox(direction) {
  if (filteredGallery.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex + direction + filteredGallery.length) % filteredGallery.length;
  openLightbox(currentLightboxIndex);
}

