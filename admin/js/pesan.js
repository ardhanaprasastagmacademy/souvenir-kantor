/**
 * PESAN.JS — Pesan Masuk dari Form Kontak (admin/pesan.html)
 * Mengatur daftar pesan, detail modal, tandai dibaca otomatis, dan balas cepat via WA & Email
 */

import { DataService } from '../../assets/js/firebase-config.js';
import { formatTanggalIndo, getWhatsAppUrl, showToast } from '../../assets/js/utils.js';

let allMessages = [];
let currentFilter = 'all'; // 'all' or 'unread'
let currentSearch = '';
let activeMessage = null;

document.addEventListener('DOMContentLoaded', async () => {
  await loadMessages();
  setupEventListeners();
});

async function loadMessages() {
  const tbody = document.getElementById('messagesTbody');
  if (!tbody) return;

  try {
    allMessages = await DataService.getCollection('messages');
    allMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    renderMessagesTable();
  } catch (err) {
    console.error("Gagal load messages:", err);
  }
}

function renderMessagesTable() {
  const tbody = document.getElementById('messagesTbody');
  if (!tbody) return;

  let filtered = allMessages;
  if (currentFilter === 'unread') {
    filtered = filtered.filter(m => !m.isRead);
  }

  if (currentSearch.trim() !== '') {
    const q = currentSearch.toLowerCase().trim();
    filtered = filtered.filter(m => 
      m.nama.toLowerCase().includes(q) || 
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.pesan && m.pesan.toLowerCase().includes(q)) ||
      (m.subjek && m.subjek.toLowerCase().includes(q))
    );
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-5 text-muted-custom">Tidak ada pesan yang sesuai filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(msg => `
    <tr style="${!msg.isRead ? 'background-color:rgba(217, 58, 0, 0.04); font-weight:600;' : ''}">
      <td>
        <span class="badge-status ${msg.isRead ? 'badge-inactive' : 'badge-featured'}">
          ${msg.isRead ? 'Dibaca' : 'Baru'}
        </span>
      </td>
      <td>
        <strong>${msg.nama}</strong><br>
        <small class="text-muted-custom">${msg.telepon || '-'}</small>
      </td>
      <td>${msg.email}</td>
      <td>${msg.subjek || 'Pertanyaan Souvenir'}</td>
      <td class="small text-muted-custom">${formatTanggalIndo(msg.createdAt)}</td>
      <td>
        <a href="#" class="action-link action-link-edit js-view-msg" data-id="${msg.id}">Buka Pesan</a>
        <a href="#" class="action-link action-link-delete js-delete-msg" data-id="${msg.id}">Hapus</a>
      </td>
    </tr>
  `).join('');

  // Attach triggers
  tbody.querySelectorAll('.js-view-msg').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openMessageModal(btn.getAttribute('data-id'));
    });
  });

  tbody.querySelectorAll('.js-delete-msg').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      handleDeleteMessage(btn.getAttribute('data-id'));
    });
  });
}

function setupEventListeners() {
  document.getElementById('filterAllBtn')?.addEventListener('click', (e) => {
    document.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = 'all';
    renderMessagesTable();
  });

  document.getElementById('filterUnreadBtn')?.addEventListener('click', (e) => {
    document.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = 'unread';
    renderMessagesTable();
  });

  document.getElementById('searchMessageInput')?.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderMessagesTable();
  });

  // Toggle tandai belum dibaca di modal
  document.getElementById('btnToggleUnread')?.addEventListener('click', async () => {
    if (!activeMessage) return;
    const newStatus = !activeMessage.isRead;
    await DataService.updateDocument('messages', activeMessage.id, { isRead: newStatus });
    activeMessage.isRead = newStatus;
    showToast(newStatus ? 'Ditandai sudah dibaca' : 'Ditandai belum dibaca', 'success');
    await loadMessages();
    const modal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('viewMessageModal'));
    modal.hide();
  });
}

async function openMessageModal(msgId) {
  const msg = allMessages.find(m => m.id === msgId);
  if (!msg) return;

  activeMessage = msg;

  // Isi modal
  document.getElementById('msgDetailNama').textContent = msg.nama;
  document.getElementById('msgDetailEmail').textContent = msg.email;
  document.getElementById('msgDetailTelepon').textContent = msg.telepon || '-';
  document.getElementById('msgDetailSubjek').textContent = msg.subjek || 'Pertanyaan Souvenir Kantor';
  document.getElementById('msgDetailTanggal').textContent = formatTanggalIndo(msg.createdAt);
  document.getElementById('msgDetailPesan').textContent = msg.pesan;

  // Tombol Balas Cepat
  const replyWaBtn = document.getElementById('msgReplyWaBtn');
  const replyEmailBtn = document.getElementById('msgReplyEmailBtn');

  if (replyWaBtn && msg.telepon) {
    const defaultReplyText = `Halo ${msg.nama}, terima kasih telah menghubungi Kenes Souvenir mengenai "${msg.subjek || 'kebutuhan souvenir'}". Saya ingin mengonfirmasi detail pesanan Anda...`;
    replyWaBtn.href = getWhatsAppUrl(msg.telepon, defaultReplyText);
    replyWaBtn.style.display = 'inline-flex';
  } else if (replyWaBtn) {
    replyWaBtn.style.display = 'none';
  }

  if (replyEmailBtn && msg.email) {
    replyEmailBtn.href = `mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subjek || 'Souvenir Kantor Kenes')}`;
  }

  // PRD 6.10: Otomatis ditandai dibaca saat dibuka
  if (!msg.isRead) {
    await DataService.updateDocument('messages', msg.id, { isRead: true });
    msg.isRead = true;
    renderMessagesTable();
  }

  const modal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('viewMessageModal'));
  modal.show();
}

async function handleDeleteMessage(id) {
  if (confirm("Hapus pesan masuk ini secara permanen?")) {
    try {
      await DataService.deleteDocument('messages', id);
      showToast('Pesan berhasil dihapus.', 'success');
      await loadMessages();
    } catch (err) {
      console.error("Gagal hapus pesan:", err);
      alert("Gagal menghapus pesan.");
    }
  }
}

