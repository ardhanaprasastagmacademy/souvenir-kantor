/**
 * PRODUK.JS — Logika Katalog Produk (produk.html)
 * Mengatur filter kategori, pencarian produk, quick view modal, dan pemesanan WhatsApp
 */

import { DataService } from './firebase-config.js';
import { getWhatsAppUrl, renderSkeletonCards } from './utils.js';

let allProducts = [];
let allCategories = [];
let currentCategory = 'all';
let currentSearch = '';

document.addEventListener('DOMContentLoaded', async () => {
  // Cek parameter kategori dari URL jika ada
  const urlParams = new URLSearchParams(window.location.search);
  const paramKategori = urlParams.get('kategori');
  if (paramKategori) {
    currentCategory = paramKategori;
  }

  // 1. Muat Banner Data
  loadBannerData();

  // 2. Muat Kategori
  await loadCategories();

  // 3. Muat Produk
  await loadProducts();

  // 4. Setup Input Pencarian
  setupSearch();

  // 5. Setup Quick View Modal
  setupQuickViewModal();
});

// 1. Muat data banner
async function loadBannerData() {
  try {
    const banners = await DataService.getDocument('settings/banners');
    if (banners && banners.produk) {
      const titleEl = document.getElementById('bannerTitle');
      const descEl = document.getElementById('bannerDesc');
      if (titleEl && banners.produk.judul) titleEl.textContent = banners.produk.judul;
      if (descEl && banners.produk.deskripsi) descEl.textContent = banners.produk.deskripsi;
    }
  } catch (e) {
    console.warn("Banner load error:", e);
  }
}

// 2. Muat Kategori ke Tab
async function loadCategories() {
  const container = document.getElementById('categoryTabsContainer');
  if (!container) return;

  try {
    allCategories = await DataService.getCollection('categories');
    allCategories.sort((a, b) => (a.urutan || 0) - (b.urutan || 0));

    const html = [
      `<button type="button" class="filter-tab-btn ${currentCategory === 'all' ? 'active' : ''}" data-category="all">Semua Produk</button>`
    ];

    allCategories.forEach(cat => {
      const isActive = currentCategory === cat.slug;
      html.push(`
        <button type="button" class="filter-tab-btn ${isActive ? 'active' : ''}" data-category="${cat.slug}">
          ${cat.nama}
        </button>
      `);
    });

    container.innerHTML = html.join('');

    // Event listener untuk filter tab
    container.querySelectorAll('.filter-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category');
        renderFilteredProducts();
      });
    });
  } catch (err) {
    console.error("Gagal memuat kategori:", err);
  }
}

// 3. Muat Data Produk
async function loadProducts() {
  const container = document.getElementById('productGridContainer');
  if (!container) return;

  container.innerHTML = renderSkeletonCards(8);

  try {
    const prods = await DataService.getCollection('products');
    allProducts = prods.filter(p => p.isActive);
    allProducts.sort((a, b) => (a.urutan || 0) - (b.urutan || 0));
    renderFilteredProducts();
  } catch (err) {
    console.error("Gagal memuat produk:", err);
    container.innerHTML = `<div class="col-12 text-center py-5 text-danger">Gagal memuat katalog produk. Silakan coba beberapa saat lagi.</div>`;
  }
}

// Filter & Render Produk
function renderFilteredProducts() {
  const container = document.getElementById('productGridContainer');
  const countEl = document.getElementById('productCountText');
  if (!container) return;

  let filtered = allProducts;

  // Filter Kategori
  if (currentCategory !== 'all') {
    const selectedCat = allCategories.find(c => c.slug === currentCategory);
    const catId = selectedCat ? selectedCat.id : null;
    filtered = filtered.filter(p => p.kategoriId === catId || p.kategoriNama?.toLowerCase() === selectedCat?.nama?.toLowerCase());
  }

  // Filter Pencarian
  if (currentSearch.trim() !== '') {
    const q = currentSearch.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.nama.toLowerCase().includes(q) || 
      (p.deskripsiSingkat && p.deskripsiSingkat.toLowerCase().includes(q)) ||
      (p.kategoriNama && p.kategoriNama.toLowerCase().includes(q))
    );
  }

  // Update counter
  if (countEl) {
    countEl.textContent = `Menampilkan ${filtered.length} produk`;
  }

  // Tampilan Kosong
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <h3 class="mb-3">Produk Tidak Ditemukan</h3>
        <p class="text-muted-custom mb-4">Tidak ada souvenir yang cocok dengan kriteria pencarian Anda.</p>
        <button type="button" class="btn-secondary-custom" id="resetFilterBtn">Reset Pencarian & Filter</button>
      </div>
    `;
    const resetBtn = document.getElementById('resetFilterBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentCategory = 'all';
        currentSearch = '';
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
        document.querySelectorAll('.filter-tab-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-category') === 'all');
        });
        renderFilteredProducts();
      });
    }
    return;
  }

  // Render Grid
  container.innerHTML = filtered.map(prod => {
    const waText = `Halo Kenes Souvenir, saya tertarik dengan produk "${prod.nama}". Mohon informasi harga dan cara pemesanannya.`;
    const waUrl = getWhatsAppUrl('082232730246', waText);

    return `
      <div class="col-6 col-md-4 col-lg-3 mb-4">
        <div class="product-card">
          <div class="product-card-img-wrap">
            <img src="${prod.gambarUrl}" alt="${prod.nama}" loading="lazy" width="300" height="375">
            ${prod.isFeatured ? '<span class="product-card-badge">Unggulan</span>' : ''}
          </div>
          <div class="product-card-body">
            <span class="product-card-category">${prod.kategoriNama || 'Souvenir'}</span>
            <a href="produk-detail.html?slug=${prod.slug}" class="product-card-title">${prod.nama}</a>
            <p class="product-card-desc">${prod.deskripsiSingkat || ''}</p>
            <div class="product-card-price">${prod.hargaMulai || 'Harga via Penawaran'}</div>
            <div class="product-card-actions">
              <button type="button" class="btn-text-custom js-quick-view-btn" data-id="${prod.id}">Pratinjau</button>
              <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-text-custom" style="color:var(--orangered-600);">Pesan WA</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Re-attach quick view triggers
  container.querySelectorAll('.js-quick-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const prodId = btn.getAttribute('data-id');
      const prod = allProducts.find(p => p.id === prodId);
      if (prod) openQuickView(prod);
    });
  });
}

// 4. Setup Input Pencarian
function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderFilteredProducts();
  });
}

// 5. Quick View Modal
function setupQuickViewModal() {
  // Bootstrap modal instance initialized via HTML
}

function openQuickView(product) {
  const modalEl = document.getElementById('quickViewModal');
  if (!modalEl) return;

  const titleEl = document.getElementById('qvTitle');
  const catEl = document.getElementById('qvCategory');
  const imgEl = document.getElementById('qvImg');
  const descEl = document.getElementById('qvDesc');
  const priceEl = document.getElementById('qvPrice');
  const waBtn = document.getElementById('qvWaBtn');
  const detailLink = document.getElementById('qvDetailLink');
  const specTbody = document.getElementById('qvSpecTbody');

  if (titleEl) titleEl.textContent = product.nama;
  if (catEl) catEl.textContent = product.kategoriNama || 'Kategori Souvenir';
  if (imgEl) {
    imgEl.src = product.gambarUrl;
    imgEl.alt = product.nama;
  }
  if (descEl) descEl.textContent = product.deskripsi || product.deskripsiSingkat || '';
  if (priceEl) priceEl.textContent = product.hargaMulai || 'Harga Sesuai Kuantiti';

  const waText = `Halo Kenes Souvenir, saya tertarik memesan "${product.nama}". Mohon penawaran harga & spesifikasi lengkapnya.`;
  if (waBtn) waBtn.href = getWhatsAppUrl('082232730246', waText);

  if (detailLink) detailLink.href = `produk-detail.html?slug=${product.slug}`;

  // Spesifikasi jika ada
  if (specTbody) {
    const spec = product.spesifikasi || {};
    const rows = [
      { k: "Bahan", v: spec.bahan },
      { k: "Kapasitas / Ukuran", v: spec.kapasitas },
      { k: "Teknik Cetak", v: spec.teknikCetak },
      { k: "Minimal Order", v: spec.minOrder || "50 pcs" },
      { k: "Waktu Produksi", v: spec.waktuProduksi || "5 – 7 hari kerja" }
    ].filter(r => Boolean(r.v));

    if (rows.length > 0) {
      specTbody.innerHTML = rows.map(r => `
        <tr>
          <th>${r.k}</th>
          <td>${r.v}</td>
        </tr>
      `).join('');
    } else {
      specTbody.innerHTML = `<tr><td colspan="2" class="text-muted-custom">Spesifikasi dapat disesuaikan dengan permintaan Anda.</td></tr>`;
    }
  }

  // Tampilkan Bootstrap Modal
  if (window.bootstrap && window.bootstrap.Modal) {
    const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }
}

