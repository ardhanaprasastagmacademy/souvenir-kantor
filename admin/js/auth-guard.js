/**
 * AUTH-GUARD.JS — Proteksi Halaman Admin
 * Memastikan pengguna sudah terautentikasi sebelum membuka halaman admin
 */

import { AuthService } from '../../assets/js/firebase-config.js';

export function checkAuth() {
  const user = AuthService.getCurrentUser();
  const isLoginPage = window.location.pathname.endsWith('login.html');

  if (!user && !isLoginPage) {
    window.location.replace('login.html');
    return null;
  }

  if (user && isLoginPage) {
    window.location.replace('index.html');
    return user;
  }

  return user;
}

// Jalankan otomatis
checkAuth();

