/**
 * BLOG.JS — Logika Halaman Indeks Blog (blog.html)
 * Menampilkan artikel terpublikasi dengan pencarian & format tanggal Indonesia
 */

import { DataService } from './firebase-config.js';
import { formatTanggalIndo } from './utils.js';

let allPosts = [];
let searchQuery = '';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Muat Banner
  loadBannerData();

  // 2. Muat Artikel
  await loadPosts();

  // 3. Setup Pencarian
  setupBlogSearch();
});

async function loadBannerData() {
  try {
    const banners = await DataService.getDocument('settings/banners');
    if (banners && banners.blog) {
      const titleEl = document.getElementById('bannerTitle');
      const descEl = document.getElementById('bannerDesc');
      if (titleEl && banners.blog.judul) titleEl.textContent = banners.blog.judul;
      if (descEl && banners.blog.deskripsi) descEl.textContent = banners.blog.deskripsi;
    }
  } catch (e) {
    console.warn("Banner error:", e);
  }
}

async function loadPosts() {
  const container = document.getElementById('blogPostsContainer');
  if (!container) return;

  try {
    const posts = await DataService.getCollection('posts');
    allPosts = posts.filter(p => p.status === 'published');
    allPosts.sort((a, b) => new Date(b.tanggalTerbit || b.createdAt) - new Date(a.tanggalTerbit || a.createdAt));

    renderPosts();
  } catch (err) {
    console.error("Gagal memuat artikel blog:", err);
    container.innerHTML = `<div class="col-12 text-center py-5 text-danger">Gagal memuat artikel blog.</div>`;
  }
}

function renderPosts() {
  const container = document.getElementById('blogPostsContainer');
  if (!container) return;

  let filtered = allPosts;
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.judul.toLowerCase().includes(q) || 
      (p.ringkasan && p.ringkasan.toLowerCase().includes(q))
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <h3 class="mb-3">Artikel Tidak Ditemukan</h3>
        <p class="text-muted-custom">Tidak ada artikel yang cocok dengan kata kunci pencarian Anda.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(post => `
    <div class="col-12 col-md-6 col-lg-4 mb-4">
      <article class="blog-card">
        <a href="blog-detail.html?slug=${post.slug}" class="blog-card-img-wrap">
          <img src="${post.thumbnailUrl || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=700&q=80'}" alt="${post.judul}" loading="lazy" width="400" height="250">
        </a>
        <div class="blog-card-body">
          <div class="blog-card-meta">
            <span>${formatTanggalIndo(post.tanggalTerbit || post.createdAt)}</span>
            <span class="mx-1">•</span>
            <span>${post.penulis || 'Tim Redaksi'}</span>
          </div>
          <a href="blog-detail.html?slug=${post.slug}" class="blog-card-title">${post.judul}</a>
          <p class="blog-card-summary">${post.ringkasan || ''}</p>
          <div class="mt-auto">
            <a href="blog-detail.html?slug=${post.slug}" class="btn-text-custom">Baca Selengkapnya</a>
          </div>
        </div>
      </article>
    </div>
  `).join('');
}

function setupBlogSearch() {
  const searchInput = document.getElementById('blogSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderPosts();
  });
}

