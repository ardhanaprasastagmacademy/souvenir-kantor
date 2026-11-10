/**
 * DASHBOARD.JS — Logika Dashboard Admin (admin/index.html)
 */

import { DataService } from '../../assets/js/firebase-config.js';
import { formatTanggalIndo } from '../../assets/js/utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadDashboardStats();
  await loadRecentMessages();
});

async function loadDashboardStats() {
  try {
    const [products, gallery, posts, messages] = await Promise.all([
      DataService.getCollection('products'),
      DataService.getCollection('gallery'),
      DataService.getCollection('posts'),
      DataService.getCollection('messages')
    ]);

    // Update Angka Statistik
    const statProd = document.getElementById('statTotalProducts');
    const statGal = document.getElementById('statTotalGallery');
    const statPosts = document.getElementById('statTotalPosts');
    const statUnread = document.getElementById('statUnreadMessages');

    if (statProd) statProd.textContent = products.length;
    if (statGal) statGal.textContent = gallery.length;
    if (statPosts) {
      const pubCount = posts.filter(p => p.status === 'published').length;
      statPosts.textContent = `${pubCount} (${posts.length - pubCount} draft)`;
    }
    if (statUnread) {
      const unread = messages.filter(m => !m.isRead).length;
      statUnread.textContent = unread;
      if (unread > 0) {
        statUnread.style.color = 'var(--orangered)';
      }
    }
  } catch (err) {
    console.error("Gagal memuat statistik dashboard:", err);
  }
}

async function loadRecentMessages() {
  const container = document.getElementById('recentMessagesTbody');
  if (!container) return;

  try {
    const messages = await DataService.getCollection('messages');
    messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const recent = messages.slice(0, 5);

    if (recent.length === 0) {
      container.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted-custom">Belum ada pesan masuk dari pengunjung.</td></tr>`;
      return;
    }

    container.innerHTML = recent.map(msg => `
      <tr>
        <td>
          <span class="badge-status ${msg.isRead ? 'badge-inactive' : 'badge-featured'}">
            ${msg.isRead ? 'Dibaca' : 'Baru'}
          </span>
        </td>
        <td><strong>${msg.nama}</strong><br><small class="text-muted-custom">${msg.telepon}</small></td>
        <td>${msg.subjek || 'Pertanyaan Souvenir'}</td>
        <td class="small text-muted-custom">${formatTanggalIndo(msg.createdAt)}</td>
        <td>
          <a href="pesan.html" class="action-link action-link-edit">Buka Detail →</a>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error("Gagal memuat pesan terbaru:", err);
  }
}

