/**
 * GALERI.JS — Kelola Galeri Portofolio di Admin (admin/galeri.html)
 */

import { DataService } from '../../assets/js/firebase-config.js';
import { showToast } from '../../assets/js/utils.js';

let allGallery = [];
let editingGalleryId = null;

document.addEventListener('DOMContentLoaded', async () => {
  await loadGallery();
  setupEventListeners();
});

async function loadGallery() {
  const tbody = document.getElementById('galleryTbody');
  if (!tbody) return;

  try {
    allGallery = await DataService.getCollection('gallery');
    allGallery.sort((a, b) => (a.urutan || 0) - (b.urutan || 0));

    if (allGallery.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted-custom">Belum ada foto galeri.</td></tr>`;
      return;
    }

    tbody.innerHTML = allGallery.map(g => `
      <tr>
        <td>
          <img src="${g.gambarUrl}" alt="${g.judul}" class="table-thumb" loading="lazy">
        </td>
        <td><strong>${g.judul}</strong></td>
        <td>${g.kategori || '-'}</td>
        <td>${g.urutan || 0}</td>
        <td>
          ${g.isActive !== false ? '<span class="badge-status badge-active">Tampil</span>' : '<span class="badge-status badge-inactive">Disembunyikan</span>'}
        </td>
        <td>
          <a href="#" class="action-link action-link-edit js-edit-gal" data-id="${g.id}">Ubah</a>
          <a href="#" class="action-link action-link-delete js-delete-gal" data-id="${g.id}" data-name="${g.judul}">Hapus</a>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.js-edit-gal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openEditModal(btn.getAttribute('data-id'));
      });
    });

    tbody.querySelectorAll('.js-delete-gal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        handleDeleteGallery(btn.getAttribute('data-id'), btn.getAttribute('data-name'));
      });
    });
  } catch (err) {
    console.error("Gagal load galeri:", err);
  }
}

function setupEventListeners() {
  document.getElementById('btnOpenAddGallery')?.addEventListener('click', () => {
    editingGalleryId = null;
    document.getElementById('galleryForm')?.reset();
    document.getElementById('galleryModalTitle').textContent = 'Unggah Foto Portofolio Baru';
    document.getElementById('galIsActiveInput').checked = true;
    const modal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('galleryModal'));
    modal.show();
  });

  document.getElementById('galleryForm')?.addEventListener('submit', handleGallerySubmit);
}

function openEditModal(id) {
  editingGalleryId = id;
  const g = allGallery.find(item => item.id === id);
  if (!g) return;

  document.getElementById('galleryModalTitle').textContent = 'Ubah Foto Galeri';
  document.getElementById('galJudulInput').value = g.judul || '';
  document.getElementById('galKategoriInput').value = g.kategori || '';
  document.getElementById('galUrlInput').value = g.gambarUrl || '';
  document.getElementById('galUrutanInput').value = g.urutan || 0;
  document.getElementById('galIsActiveInput').checked = g.isActive !== false;

  const modal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('galleryModal'));
  modal.show();
}

async function handleGallerySubmit(e) {
  e.preventDefault();
  const submitBtn = document.getElementById('btnSaveGallery');
  submitBtn.disabled = true;

  let finalUrl = document.getElementById('galUrlInput').value.trim();
  const fileInput = document.getElementById('galFileInput');
  if (fileInput.files.length > 0) {
    const uploaded = await DataService.uploadImage(fileInput.files[0], 'gallery');
    finalUrl = uploaded.url;
  }

  if (!finalUrl) {
    finalUrl = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';
  }

  const payload = {
    judul: document.getElementById('galJudulInput').value.trim(),
    kategori: document.getElementById('galKategoriInput').value.trim(),
    gambarUrl: finalUrl,
    urutan: parseInt(document.getElementById('galUrutanInput').value, 10) || 0,
    isActive: document.getElementById('galIsActiveInput').checked
  };

  try {
    if (editingGalleryId) {
      await DataService.updateDocument('gallery', editingGalleryId, payload);
      showToast('Foto portofolio diperbarui.', 'success');
    } else {
      await DataService.addDocument('gallery', payload);
      showToast('Foto baru berhasil diunggah.', 'success');
    }

    const modal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('galleryModal'));
    modal.hide();
    await loadGallery();
  } catch (err) {
    console.error("Gagal simpan galeri:", err);
    alert("Terjadi kesalahan saat menyimpan foto:\n\n" + (err.message || err));
  } finally {
    submitBtn.disabled = false;
  }
}

async function handleDeleteGallery(id, name) {
  if (confirm(`Hapus foto portofolio "${name}"?`)) {
    try {
      await DataService.deleteDocument('gallery', id);
      showToast('Foto berhasil dihapus.', 'success');
      await loadGallery();
    } catch (err) {
      console.error("Gagal hapus foto:", err);
      alert("Gagal menghapus foto.");
    }
  }
}

