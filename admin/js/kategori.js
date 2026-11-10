/**
 * KATEGORI.JS — Kelola Kategori Produk (admin/kategori.html)
 * CRUD Kategori + Proteksi penghapusan jika kategori masih dipakai produk
 */

import { DataService } from '../../assets/js/firebase-config.js';
import { slugify, showToast } from '../../assets/js/utils.js';

let allCategories = [];
let allProducts = [];
let editingCategoryId = null;

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  setupEventListeners();
});

async function loadData() {
  const tbody = document.getElementById('categoryTbody');
  if (!tbody) return;

  try {
    [allCategories, allProducts] = await Promise.all([
      DataService.getCollection('categories'),
      DataService.getCollection('products')
    ]);

    allCategories.sort((a, b) => (a.urutan || 0) - (b.urutan || 0));

    if (allCategories.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted-custom">Belum ada kategori produk.</td></tr>`;
      return;
    }

    tbody.innerHTML = allCategories.map(cat => {
      const count = allProducts.filter(p => p.kategoriId === cat.id).length;
      return `
        <tr>
          <td><strong>${cat.urutan || 0}</strong></td>
          <td><strong>${cat.nama}</strong></td>
          <td><code>/${cat.slug}</code></td>
          <td>${count} produk</td>
          <td>
            <a href="#" class="action-link action-link-edit js-edit-cat" data-id="${cat.id}">Ubah</a>
            <a href="#" class="action-link action-link-delete js-delete-cat" data-id="${cat.id}" data-name="${cat.nama}" data-count="${count}">Hapus</a>
          </td>
        </tr>
      `;
    }).join('');

    // Attach actions
    tbody.querySelectorAll('.js-edit-cat').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openEditModal(btn.getAttribute('data-id'));
      });
    });

    tbody.querySelectorAll('.js-delete-cat').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const count = parseInt(btn.getAttribute('data-count'), 10);
        handleDeleteCategory(id, name, count);
      });
    });
  } catch (err) {
    console.error("Gagal load categories:", err);
  }
}

function setupEventListeners() {
  document.getElementById('btnOpenAddCategory')?.addEventListener('click', () => {
    editingCategoryId = null;
    document.getElementById('categoryForm')?.reset();
    document.getElementById('categoryModalTitle').textContent = 'Tambah Kategori Baru';
    const modal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('categoryModal'));
    modal.show();
  });

  const nameInput = document.getElementById('catNameInput');
  const slugInput = document.getElementById('catSlugInput');
  if (nameInput && slugInput) {
    nameInput.addEventListener('input', () => {
      if (!editingCategoryId) {
        slugInput.value = slugify(nameInput.value);
      }
    });
  }

  document.getElementById('categoryForm')?.addEventListener('submit', handleCategorySubmit);
}

function openEditModal(catId) {
  editingCategoryId = catId;
  const cat = allCategories.find(c => c.id === catId);
  if (!cat) return;

  document.getElementById('categoryModalTitle').textContent = 'Ubah Kategori: ' + cat.nama;
  document.getElementById('catNameInput').value = cat.nama || '';
  document.getElementById('catSlugInput').value = cat.slug || '';
  document.getElementById('catUrutanInput').value = cat.urutan || 0;

  const modal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('categoryModal'));
  modal.show();
}

async function handleCategorySubmit(e) {
  e.preventDefault();
  const nama = document.getElementById('catNameInput').value.trim();
  const slug = document.getElementById('catSlugInput').value.trim() || slugify(nama);
  const urutan = parseInt(document.getElementById('catUrutanInput').value, 10) || 0;

  if (!nama) return;

  const payload = { nama, slug, urutan };

  try {
    if (editingCategoryId) {
      await DataService.updateDocument('categories', editingCategoryId, payload);
      showToast('Kategori berhasil diperbarui.', 'success');
    } else {
      await DataService.addDocument('categories', payload);
      showToast('Kategori baru berhasil ditambahkan.', 'success');
    }

    const modal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('categoryModal'));
    modal.hide();
    await loadData();
  } catch (err) {
    console.error("Error submit category:", err);
    alert("Gagal menyimpan kategori:\n\n" + (err.message || err));
  }
}

async function handleDeleteCategory(id, name, count) {
  // PRD 6.5: Kategori yang masih dipakai produk tidak bisa dihapus (tampilkan peringatan)
  if (count > 0) {
    alert(`PERINGATAN: Kategori "${name}" masih digunakan oleh ${count} produk!\n\nUntuk menjaga keutuhan data katalog, silakan ubah atau hapus produk terkait terlebih dahulu sebelum menghapus kategori ini.`);
    return;
  }

  if (confirm(`Apakah Anda yakin ingin menghapus kategori "${name}"?`)) {
    try {
      await DataService.deleteDocument('categories', id);
      showToast('Kategori berhasil dihapus.', 'success');
      await loadData();
    } catch (err) {
      console.error("Error delete category:", err);
      alert("Gagal menghapus kategori.");
    }
  }
}

