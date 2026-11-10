/**
 * ADMIN-LAYOUT.JS — Komponen Sidebar, Topbar & Navigasi Admin
 */

import { AuthService, DataService } from '../../assets/js/firebase-config.js';

export async function initAdminLayout(activePageKey = 'dashboard') {
  const user = AuthService.getCurrentUser() || { displayName: "Admin", email: "admin@kenessouvenir.com" };

  // Hitung pesan belum dibaca
  let unreadCount = 0;
  try {
    const messages = await DataService.getCollection('messages');
    unreadCount = messages.filter(m => !m.isRead).length;
  } catch (e) {
    console.warn("Unread count error:", e);
  }

  // 1. Injeksi Sidebar Desktop & Mobile Offcanvas
  const sidebarContainer = document.getElementById('adminSidebarContainer');
  if (sidebarContainer) {
    sidebarContainer.innerHTML = `
      <aside class="admin-sidebar">
        <div class="admin-sidebar-header">
          <a href="index.html" class="admin-brand">KENES</a>
          <span class="admin-brand-sub">Panel Manajemen Souvenir</span>
        </div>
        <ul class="admin-menu">
          <li class="admin-menu-section-label">Utama</li>
          <li class="admin-menu-item">
            <a href="index.html" class="admin-menu-link ${activePageKey === 'dashboard' ? 'active' : ''}">
              <span>Dashboard</span>
            </a>
          </li>
          <li class="admin-menu-item">
            <a href="pesan.html" class="admin-menu-link ${activePageKey === 'pesan' ? 'active' : ''}">
              <span>Pesan Masuk</span>
              ${unreadCount > 0 ? `<span class="admin-menu-badge">${unreadCount}</span>` : ''}
            </a>
          </li>

          <li class="admin-menu-section-label">Katalog & Portofolio</li>
          <li class="admin-menu-item">
            <a href="produk.html" class="admin-menu-link ${activePageKey === 'produk' ? 'active' : ''}">
              <span>Kelola Produk</span>
            </a>
          </li>
          <li class="admin-menu-item">
            <a href="kategori.html" class="admin-menu-link ${activePageKey === 'kategori' ? 'active' : ''}">
              <span>Kategori Produk</span>
            </a>
          </li>
          <li class="admin-menu-item">
            <a href="galeri.html" class="admin-menu-link ${activePageKey === 'galeri' ? 'active' : ''}">
              <span>Galeri Portofolio</span>
            </a>
          </li>

          <li class="admin-menu-section-label">Editorial & Interaksi</li>
          <li class="admin-menu-item">
            <a href="blog.html" class="admin-menu-link ${activePageKey === 'blog' ? 'active' : ''}">
              <span>Artikel Blog</span>
            </a>
          </li>
          <li class="admin-menu-item">
            <a href="testimoni.html" class="admin-menu-link ${activePageKey === 'testimoni' ? 'active' : ''}">
              <span>Testimoni Klien</span>
            </a>
          </li>
          <li class="admin-menu-item">
            <a href="faq.html" class="admin-menu-link ${activePageKey === 'faq' ? 'active' : ''}">
              <span>FAQ / Tanya Jawab</span>
            </a>
          </li>

          <li class="admin-menu-section-label">Situs & Konfigurasi</li>
          <li class="admin-menu-item">
            <a href="konten.html" class="admin-menu-link ${activePageKey === 'konten' ? 'active' : ''}">
              <span>Konten Halaman</span>
            </a>
          </li>
          <li class="admin-menu-item">
            <a href="pengaturan.html" class="admin-menu-link ${activePageKey === 'pengaturan' ? 'active' : ''}">
              <span>Pengaturan Website</span>
            </a>
          </li>
        </ul>
        <div class="admin-sidebar-footer">
          <a href="../index.html" target="_blank" class="small text-white-50 text-decoration-none">
            Lihat Website ↗
          </a>
          <button type="button" class="btn btn-sm btn-outline-light js-admin-logout" style="font-size:0.75rem; border-radius:2px;">
            Keluar
          </button>
        </div>
      </aside>
    `;
  }

  // 2. Injeksi Topbar
  const topbarContainer = document.getElementById('adminTopbarContainer');
  if (topbarContainer) {
    topbarContainer.innerHTML = `
      <header class="admin-topbar">
        <div class="d-flex align-items-center gap-3">
          <button class="btn btn-sm d-lg-none p-1 border text-dark" type="button" data-bs-toggle="offcanvas" data-bs-target="#adminMobileSidebar" aria-label="Buka Menu Admin">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <span class="fw-bold small text-uppercase" style="letter-spacing:0.1em; color:var(--ink);">Kenes Souvenir Admin</span>
        </div>
        <div class="d-flex align-items-center gap-3">
          <span class="small text-muted-custom d-none d-sm-inline">${user.email}</span>
          <a href="../index.html" target="_blank" class="btn btn-sm btn-outline-dark" style="font-size:0.8125rem; border-radius:2px;">
            Buka Situs ↗
          </a>
          <button type="button" class="btn btn-sm btn-dark js-admin-logout" style="font-size:0.8125rem; border-radius:2px; background:var(--orangered-600); border-color:var(--orangered-600);">
            Logout
          </button>
        </div>
      </header>

      <!-- Offcanvas Mobile Sidebar -->
      <div class="offcanvas offcanvas-start bg-ink text-white" tabindex="-1" id="adminMobileSidebar" style="width:280px; background-color:var(--ink) !important;">
        <div class="offcanvas-header border-bottom border-secondary">
          <div class="admin-brand text-white">KENES</div>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Tutup"></button>
        </div>
        <div class="offcanvas-body p-0">
          <ul class="admin-menu p-3">
            <li class="admin-menu-item"><a href="index.html" class="admin-menu-link ${activePageKey === 'dashboard' ? 'active' : ''}">Dashboard</a></li>
            <li class="admin-menu-item"><a href="pesan.html" class="admin-menu-link ${activePageKey === 'pesan' ? 'active' : ''}">Pesan Masuk (${unreadCount})</a></li>
            <li class="admin-menu-item"><a href="produk.html" class="admin-menu-link ${activePageKey === 'produk' ? 'active' : ''}">Kelola Produk</a></li>
            <li class="admin-menu-item"><a href="kategori.html" class="admin-menu-link ${activePageKey === 'kategori' ? 'active' : ''}">Kategori Produk</a></li>
            <li class="admin-menu-item"><a href="galeri.html" class="admin-menu-link ${activePageKey === 'galeri' ? 'active' : ''}">Galeri Portofolio</a></li>
            <li class="admin-menu-item"><a href="blog.html" class="admin-menu-link ${activePageKey === 'blog' ? 'active' : ''}">Artikel Blog</a></li>
            <li class="admin-menu-item"><a href="testimoni.html" class="admin-menu-link ${activePageKey === 'testimoni' ? 'active' : ''}">Testimoni Klien</a></li>
            <li class="admin-menu-item"><a href="faq.html" class="admin-menu-link ${activePageKey === 'faq' ? 'active' : ''}">FAQ</a></li>
            <li class="admin-menu-item"><a href="konten.html" class="admin-menu-link ${activePageKey === 'konten' ? 'active' : ''}">Konten Halaman</a></li>
            <li class="admin-menu-item"><a href="pengaturan.html" class="admin-menu-link ${activePageKey === 'pengaturan' ? 'active' : ''}">Pengaturan Website</a></li>
          </ul>
        </div>
      </div>
    `;
  }

  // 3. Pasang Event Logout
  document.querySelectorAll('.js-admin-logout').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm("Apakah Anda yakin ingin keluar dari panel admin?")) {
        AuthService.logout();
      }
    });
  });
}

