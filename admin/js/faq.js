/**
 * FAQ.JS — Kelola FAQ / Tanya Jawab di Admin (admin/faq.html)
 */

import { DataService } from '../../assets/js/firebase-config.js';
import { showToast } from '../../assets/js/utils.js';

let allFaqs = [];
let editingFaqId = null;

document.addEventListener('DOMContentLoaded', async () => {
  await loadFaqs();
  setupEventListeners();
});

async function loadFaqs() {
  const tbody = document.getElementById('faqTbody');
  if (!tbody) return;

  try {
    allFaqs = await DataService.getCollection('faqs');
    allFaqs.sort((a, b) => (a.urutan || 0) - (b.urutan || 0));

    if (allFaqs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted-custom">Belum ada daftar FAQ.</td></tr>`;
      return;
    }

    tbody.innerHTML = allFaqs.map(f => `
      <tr>
        <td><strong>${f.urutan || 0}</strong></td>
        <td><strong>${f.pertanyaan}</strong></td>
        <td style="max-width:320px;"><small class="text-muted-custom">${f.jawaban}</small></td>
        <td>
          ${f.isActive !== false ? '<span class="badge-status badge-active">Tampil</span>' : '<span class="badge-status badge-inactive">Disembunyikan</span>'}
        </td>
        <td>
          <a href="#" class="action-link action-link-edit js-edit-faq" data-id="${f.id}">Ubah</a>
          <a href="#" class="action-link action-link-delete js-delete-faq" data-id="${f.id}">Hapus</a>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.js-edit-faq').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openEditModal(btn.getAttribute('data-id'));
      });
    });

    tbody.querySelectorAll('.js-delete-faq').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        handleDeleteFaq(btn.getAttribute('data-id'));
      });
    });
  } catch (err) {
    console.error("Gagal load FAQ:", err);
  }
}

function setupEventListeners() {
  document.getElementById('btnOpenAddFaq')?.addEventListener('click', () => {
    editingFaqId = null;
    document.getElementById('faqForm')?.reset();
    document.getElementById('faqModalTitle').textContent = 'Tambah FAQ Baru';
    document.getElementById('faqIsActiveInput').checked = true;
    const modal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('faqModal'));
    modal.show();
  });

  document.getElementById('faqForm')?.addEventListener('submit', handleFaqSubmit);
}

function openEditModal(id) {
  editingFaqId = id;
  const f = allFaqs.find(item => item.id === id);
  if (!f) return;

  document.getElementById('faqModalTitle').textContent = 'Ubah Pertanyaan FAQ';
  document.getElementById('faqPertanyaanInput').value = f.pertanyaan || '';
  document.getElementById('faqJawabanInput').value = f.jawaban || '';
  document.getElementById('faqUrutanInput').value = f.urutan || 0;
  document.getElementById('faqIsActiveInput').checked = f.isActive !== false;

  const modal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('faqModal'));
  modal.show();
}

async function handleFaqSubmit(e) {
  e.preventDefault();
  const payload = {
    pertanyaan: document.getElementById('faqPertanyaanInput').value.trim(),
    jawaban: document.getElementById('faqJawabanInput').value.trim(),
    urutan: parseInt(document.getElementById('faqUrutanInput').value, 10) || 0,
    isActive: document.getElementById('faqIsActiveInput').checked
  };

  try {
    if (editingFaqId) {
      await DataService.updateDocument('faqs', editingFaqId, payload);
      showToast('FAQ berhasil diperbarui.', 'success');
    } else {
      await DataService.addDocument('faqs', payload);
      showToast('FAQ baru berhasil ditambahkan.', 'success');
    }

    const modal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('faqModal'));
    modal.hide();
    await loadFaqs();
  } catch (err) {
    console.error("Gagal simpan FAQ:", err);
    alert("Gagal menyimpan FAQ.");
  }
}

async function handleDeleteFaq(id) {
  if (confirm("Apakah Anda yakin ingin menghapus pertanyaan FAQ ini?")) {
    try {
      await DataService.deleteDocument('faqs', id);
      showToast('FAQ berhasil dihapus.', 'success');
      await loadFaqs();
    } catch (err) {
      console.error("Gagal hapus FAQ:", err);
      alert("Gagal menghapus FAQ.");
    }
  }
}

