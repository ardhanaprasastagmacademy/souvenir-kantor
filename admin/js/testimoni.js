/**
 * TESTIMONI.JS — Kelola Testimoni Klien di Admin (admin/testimoni.html)
 */

import { DataService } from '../../assets/js/firebase-config.js';
import { showToast } from '../../assets/js/utils.js';

let allTestis = [];
let editingTestiId = null;

document.addEventListener('DOMContentLoaded', async () => {
  await loadTestimonials();
  setupEventListeners();
});

async function loadTestimonials() {
  const tbody = document.getElementById('testiTbody');
  if (!tbody) return;

  try {
    allTestis = await DataService.getCollection('testimonials');

    if (allTestis.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted-custom">Belum ada testimoni.</td></tr>`;
      return;
    }

    tbody.innerHTML = allTestis.map(t => `
      <tr>
        <td><strong>${t.nama}</strong></td>
        <td>${t.perusahaan || '-'}</td>
        <td style="max-width:300px;"><small>“${t.isi}”</small></td>
        <td>
          ${t.isActive !== false ? '<span class="badge-status badge-active">Tampil</span>' : '<span class="badge-status badge-inactive">Disembunyikan</span>'}
        </td>
        <td>
          <a href="#" class="action-link action-link-edit js-edit-testi" data-id="${t.id}">Ubah</a>
          <a href="#" class="action-link action-link-delete js-delete-testi" data-id="${t.id}" data-name="${t.nama}">Hapus</a>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.js-edit-testi').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openEditModal(btn.getAttribute('data-id'));
      });
    });

    tbody.querySelectorAll('.js-delete-testi').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        handleDeleteTesti(btn.getAttribute('data-id'), btn.getAttribute('data-name'));
      });
    });
  } catch (err) {
    console.error("Gagal load testimoni:", err);
  }
}

function setupEventListeners() {
  document.getElementById('btnOpenAddTesti')?.addEventListener('click', () => {
    editingTestiId = null;
    document.getElementById('testiForm')?.reset();
    document.getElementById('testiModalTitle').textContent = 'Tambah Testimoni Klien';
    document.getElementById('testiIsActiveInput').checked = true;
    const modal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('testiModal'));
    modal.show();
  });

  document.getElementById('testiForm')?.addEventListener('submit', handleTestiSubmit);
}

function openEditModal(id) {
  editingTestiId = id;
  const t = allTestis.find(item => item.id === id);
  if (!t) return;

  document.getElementById('testiModalTitle').textContent = 'Ubah Testimoni: ' + t.nama;
  document.getElementById('testiNamaInput').value = t.nama || '';
  document.getElementById('testiPerusahaanInput').value = t.perusahaan || '';
  document.getElementById('testiIsiInput').value = t.isi || '';
  document.getElementById('testiIsActiveInput').checked = t.isActive !== false;

  const modal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('testiModal'));
  modal.show();
}

async function handleTestiSubmit(e) {
  e.preventDefault();
  const payload = {
    nama: document.getElementById('testiNamaInput').value.trim(),
    perusahaan: document.getElementById('testiPerusahaanInput').value.trim(),
    isi: document.getElementById('testiIsiInput').value.trim(),
    rating: 5,
    isActive: document.getElementById('testiIsActiveInput').checked
  };

  try {
    if (editingTestiId) {
      await DataService.updateDocument('testimonials', editingTestiId, payload);
      showToast('Testimoni berhasil diperbarui.', 'success');
    } else {
      await DataService.addDocument('testimonials', payload);
      showToast('Testimoni baru berhasil ditambahkan.', 'success');
    }

    const modal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('testiModal'));
    modal.hide();
    await loadTestimonials();
  } catch (err) {
    console.error("Gagal simpan testimoni:", err);
    alert("Gagal menyimpan testimoni.");
  }
}

async function handleDeleteTesti(id, name) {
  if (confirm(`Hapus testimoni dari "${name}"?`)) {
    try {
      await DataService.deleteDocument('testimonials', id);
      showToast('Testimoni berhasil dihapus.', 'success');
      await loadTestimonials();
    } catch (err) {
      console.error("Gagal hapus testimoni:", err);
      alert("Gagal menghapus testimoni.");
    }
  }
}

