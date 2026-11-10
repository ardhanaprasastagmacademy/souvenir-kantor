/**
 * PRODUK.JS — Kelola Produk di Panel Admin (admin/produk.html)
 */

import { DataService } from '../../assets/js/firebase-config.js';
import { slugify, showToast, compressImage } from '../../assets/js/utils.js';

let allProducts = [];
let allCategories = [];
let editingProductId = null;
let deleteTargetId = null;

document.addEventListener('DOMContentLoaded', async () => {
  await loadCategories();
  await loadProducts();
  setupEventListeners();
});

async function loadCategories() {
  allCategories = await DataService.getCollection('categories');
  const catSelect = document.getElementById('prodCategoryInput');
  const catFilter = document.getElementById('filterCategorySelect');

  if (catSelect) {
    catSelect.innerHTML = `<option value="">-- Pilih Kategori --</option>` +
      allCategories.map(c => `<option value="${c.id}" data-nama="${c.nama}">${c.nama}</option>`).join('');
  }
  if (catFilter) {
    catFilter.innerHTML = `<option value="">Semua Kategori</option>` +
      allCategories.map(c => `<option value="${c.id}">${c.nama}</option>`).join('');
  }
}

async function loadProducts() {
  const tbody = document.getElementById('productTbody');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4">Memuat data produk...</td></tr>`;

  try {
    allProducts = await DataService.getCollection('products');
    allProducts.sort((a, b) => (a.urutan || 0) - (b.urutan || 0));
    renderProductTable();
  } catch (err) {
    console.error("Gagal load products:", err);
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger py-4">Gagal memuat produk.</td></tr>`;
  }
}

function renderProductTable() {
  const tbody = document.getElementById('productTbody');
  const filterCat = document.getElementById('filterCategorySelect')?.value || '';
  const searchQ = document.getElementById('adminProdSearch')?.value.toLowerCase().trim() || '';

  let filtered = allProducts;
  if (filterCat) {
    filtered = filtered.filter(p => p.kategoriId === filterCat);
  }
  if (searchQ) {
    filtered = filtered.filter(p => p.nama.toLowerCase().includes(searchQ));
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-5 text-muted-custom">Tidak ada produk yang sesuai.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => `
    <tr>
      <td>
        <img src="${p.gambarUrl}" alt="${p.nama}" class="table-thumb" loading="lazy">
      </td>
      <td>
        <strong>${p.nama}</strong><br>
        <small class="text-muted-custom">/${p.slug}</small>
      </td>
      <td>${p.kategoriNama || '-'}</td>
      <td>${p.hargaMulai || 'Penawaran'}</td>
      <td>
        ${p.isFeatured ? '<span class="badge-status badge-featured">Unggulan</span>' : '<span class="badge-status badge-inactive">Biasa</span>'}
      </td>
      <td>
        ${p.isActive ? '<span class="badge-status badge-active">Aktif</span>' : '<span class="badge-status badge-inactive">Nonaktif</span>'}
      </td>
      <td>
        <a href="#" class="action-link action-link-edit js-edit-prod" data-id="${p.id}">Ubah</a>
        <a href="#" class="action-link action-link-delete js-delete-prod" data-id="${p.id}" data-name="${p.nama}">Hapus</a>
      </td>
    </tr>
  `).join('');

  // Re-attach triggers
  tbody.querySelectorAll('.js-edit-prod').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openEditModal(btn.getAttribute('data-id'));
    });
  });

  tbody.querySelectorAll('.js-delete-prod').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openDeleteConfirm(btn.getAttribute('data-id'), btn.getAttribute('data-name'));
    });
  });
}

function setupEventListeners() {
  // Tambah Produk
  const addBtn = document.getElementById('btnOpenAddProduct');
  if (addBtn) {
    addBtn.addEventListener('click', () => openAddModal());
  }

  // Auto-slugify judul produk
  const nameInput = document.getElementById('prodNameInput');
  const slugInput = document.getElementById('prodSlugInput');
  if (nameInput && slugInput) {
    nameInput.addEventListener('input', () => {
      nameInput.classList.remove('is-invalid');
      if (!editingProductId) {
        slugInput.value = slugify(nameInput.value);
      }
    });
  }

  document.getElementById('prodCategoryInput')?.addEventListener('change', (e) => {
    if (e.target.value) e.target.classList.remove('is-invalid');
  });

  // Pratinjau langsung gambar produk
  const imgUrlInput = document.getElementById('prodImageUrlInput');
  const fileInput = document.getElementById('prodImageFileInput');
  const previewWrap = document.getElementById('prodImagePreviewWrap');
  const previewImg = document.getElementById('prodImagePreview');

  if (imgUrlInput && previewWrap && previewImg) {
    imgUrlInput.addEventListener('input', () => {
      const val = imgUrlInput.value.trim();
      if (val) {
        previewImg.src = val;
        previewWrap.style.display = 'block';
      } else {
        previewWrap.style.display = 'none';
      }
    });
  }

  if (fileInput && previewWrap && previewImg) {
    fileInput.addEventListener('change', async () => {
      if (fileInput.files.length > 0) {
        const compressed = await compressImage(fileInput.files[0], 400, 400, 0.7);
        if (compressed) {
          previewImg.src = compressed;
          previewWrap.style.display = 'block';
        }
      }
    });
  }

  // Filter & Search
  document.getElementById('filterCategorySelect')?.addEventListener('change', renderProductTable);
  document.getElementById('adminProdSearch')?.addEventListener('input', renderProductTable);

  // Form Submit
  const form = document.getElementById('productForm');
  if (form) {
    form.addEventListener('submit', handleProductSubmit);
  }

  // Confirm Delete
  document.getElementById('btnConfirmDeleteProduct')?.addEventListener('click', handleDeleteProduct);
}

function openAddModal() {
  editingProductId = null;
  const form = document.getElementById('productForm');
  if (form) {
    form.reset();
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  }

  const previewWrap = document.getElementById('prodImagePreviewWrap');
  if (previewWrap) previewWrap.style.display = 'none';

  document.getElementById('productModalTitle').textContent = 'Tambah Produk Baru';
  document.getElementById('prodIsActiveInput').checked = true;
  document.getElementById('prodIsFeaturedInput').checked = false;

  const modal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('productModal'));
  modal.show();
}

function openEditModal(productId) {
  editingProductId = productId;
  const p = allProducts.find(item => item.id === productId);
  if (!p) return;

  const form = document.getElementById('productForm');
  if (form) {
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  }

  document.getElementById('productModalTitle').textContent = 'Ubah Produk: ' + p.nama;
  document.getElementById('prodNameInput').value = p.nama || '';
  document.getElementById('prodSlugInput').value = p.slug || '';
  document.getElementById('prodCategoryInput').value = p.kategoriId || '';
  document.getElementById('prodPriceInput').value = p.hargaMulai || '';
  document.getElementById('prodImageUrlInput').value = p.gambarUrl || '';
  document.getElementById('prodShortDescInput').value = p.deskripsiSingkat || '';
  document.getElementById('prodDescInput').value = p.deskripsi || '';
  document.getElementById('prodIsFeaturedInput').checked = Boolean(p.isFeatured);
  document.getElementById('prodIsActiveInput').checked = p.isActive !== false;

  // Pratinjau gambar jika ada
  const previewWrap = document.getElementById('prodImagePreviewWrap');
  const previewImg = document.getElementById('prodImagePreview');
  if (previewWrap && previewImg && p.gambarUrl) {
    previewImg.src = p.gambarUrl;
    previewWrap.style.display = 'block';
  } else if (previewWrap) {
    previewWrap.style.display = 'none';
  }

  // Spesifikasi
  const s = p.spesifikasi || {};
  document.getElementById('specBahan').value = s.bahan || '';
  document.getElementById('specKapasitas').value = s.kapasitas || '';
  document.getElementById('specTeknik').value = s.teknikCetak || '';
  document.getElementById('specWarna').value = s.warna || '';
  document.getElementById('specMinOrder').value = s.minOrder || '';
  document.getElementById('specWaktu').value = s.waktuProduksi || '';
  document.getElementById('specKemasan').value = s.kemasan || '';

  const modal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('productModal'));
  modal.show();
}

async function handleProductSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = document.getElementById('btnSaveProduct');

  // Bersihkan kelas is-invalid sebelumnya
  form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

  // Validasi Nama Produk
  const nameInput = document.getElementById('prodNameInput');
  const nama = nameInput.value.trim();
  if (!nama) {
    showToast('Nama Produk wajib diisi.', 'error');
    nameInput.classList.add('is-invalid');
    nameInput.focus();
    nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Validasi Slug (Otomatis dibuat jika kosong)
  const slugInput = document.getElementById('prodSlugInput');
  let slug = slugInput.value.trim();
  if (!slug) {
    slug = slugify(nama);
    slugInput.value = slug;
  }

  // Validasi Kategori
  const catSelect = document.getElementById('prodCategoryInput');
  const kategoriId = catSelect.value;
  if (!kategoriId) {
    showToast('Silakan pilih Kategori Produk.', 'error');
    catSelect.classList.add('is-invalid');
    catSelect.focus();
    catSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const selectedCatOption = catSelect.options[catSelect.selectedIndex];
  const kategoriNama = selectedCatOption ? (selectedCatOption.getAttribute('data-nama') || selectedCatOption.text) : '';

  // Nonaktifkan tombol & ubah teks ke mode memuat
  submitBtn.disabled = true;
  const originalBtnHtml = submitBtn.innerHTML;
  submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Menyimpan Produk...`;

  try {
    // Unggah file gambar jika dipilih (dengan optimasi otomatis)
    let finalImageUrl = document.getElementById('prodImageUrlInput').value.trim();
    const fileInput = document.getElementById('prodImageFileInput');
    if (fileInput.files.length > 0) {
      const uploaded = await DataService.uploadImage(fileInput.files[0], 'products');
      finalImageUrl = uploaded.url;
    }

    if (!finalImageUrl) {
      finalImageUrl = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80';
    }

    const payload = {
      nama,
      slug,
      kategoriId,
      kategoriNama,
      hargaMulai: document.getElementById('prodPriceInput').value.trim(),
      gambarUrl: finalImageUrl,
      deskripsiSingkat: document.getElementById('prodShortDescInput').value.trim(),
      deskripsi: document.getElementById('prodDescInput').value.trim(),
      isFeatured: document.getElementById('prodIsFeaturedInput').checked,
      isActive: document.getElementById('prodIsActiveInput').checked,
      spesifikasi: {
        bahan: document.getElementById('specBahan').value.trim(),
        kapasitas: document.getElementById('specKapasitas').value.trim(),
        teknikCetak: document.getElementById('specTeknik').value.trim(),
        warna: document.getElementById('specWarna').value.trim(),
        minOrder: document.getElementById('specMinOrder').value.trim(),
        waktuProduksi: document.getElementById('specWaktu').value.trim(),
        kemasan: document.getElementById('specKemasan').value.trim()
      }
    };

    if (editingProductId) {
      await DataService.updateDocument('products', editingProductId, payload);
      showToast('Produk berhasil diperbarui!', 'success');
    } else {
      await DataService.addDocument('products', payload);
      showToast('Produk baru berhasil ditambahkan!', 'success');
    }

    const modal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('productModal'));
    modal.hide();
    await loadProducts();
  } catch (err) {
    console.error("Error simpan produk:", err);
    showToast('Gagal: ' + (err.message || 'Terjadi kesalahan.'), 'error');
    alert("Terjadi kendala saat menyimpan produk:\n\n" + (err.message || err));
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnHtml;
  }
}

function openDeleteConfirm(id, name) {
  deleteTargetId = id;
  document.getElementById('deleteProductName').textContent = name;
  const modal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteConfirmModal'));
  modal.show();
}

async function handleDeleteProduct() {
  if (!deleteTargetId) return;
  const deleteBtn = document.getElementById('btnConfirmDeleteProduct');
  if (deleteBtn) {
    deleteBtn.disabled = true;
    deleteBtn.textContent = 'Menghapus...';
  }

  try {
    await DataService.deleteDocument('products', deleteTargetId);
    showToast('Produk berhasil dihapus.', 'success');
    const modal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteConfirmModal'));
    modal.hide();
    await loadProducts();
  } catch (err) {
    console.error("Error delete product:", err);
    alert("Gagal menghapus produk: " + (err.message || err));
  } finally {
    if (deleteBtn) {
      deleteBtn.disabled = false;
      deleteBtn.textContent = 'Hapus Sekarang';
    }
    deleteTargetId = null;
  }
}

