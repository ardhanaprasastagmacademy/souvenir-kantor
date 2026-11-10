/**
 * MAIN.JS — Global Script untuk Halaman Publik Souvenir Kantor
 * Mengatur Navbar, Mobile Menu, Back to Top, WA Pop Up, dan Sinkronisasi Pengaturan
 */

import { DataService } from './firebase-config.js';
import { getWhatsAppUrl } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Ambil Pengaturan Umum (General Settings)
  let generalSettings = {
    namaBisnis: "Kenes Souvenir & Merchandise Kantor",
    whatsapp: "082232730246",
    waPesanAwal: "Halo Kenes Souvenir, saya ingin konsultasi kebutuhan souvenir kantor dan merchandise custom logo.",
    email: "halo@kenessouvenir.com",
    alamat: "Jl. Margonda Raya No. 188, Beji, Kota Depok, Jawa Barat 16423 (Melayani Seluruh Indonesia)",
    jamOperasional: "Senin – Jumat: 08.30 – 17.00 WIB | Sabtu: 09.00 – 14.00 WIB",
    sosial: {
      instagram: "https://instagram.com/kenessouvenir",
      facebook: "https://facebook.com/kenessouvenir"
    }
  };

  try {
    const fetched = await DataService.getDocument('settings/general');
    if (fetched) {
      generalSettings = { ...generalSettings, ...fetched };
    }
  } catch (e) {
    console.warn("Using fallback general settings:", e);
  }

  // 2. Pasang nomor WA dan link pada elemen global
  setupWhatsAppElements(generalSettings);

  // 3. Navbar Sticky Effect
  setupNavbarScroll();

  // 4. Highlight Nav Aktif
  highlightActiveNavLink();

  // 5. Back to Top Button
  setupBackToTop();

  // 6. WhatsApp Popup Dialog
  setupWhatsAppPopup(generalSettings);

  // 7. Render Footer Data
  populateFooterData(generalSettings);

  // 8. Injeksi JSON-LD LocalBusiness dasar
  injectLocalBusinessSchema(generalSettings);
});

// Setup WA links pada tombol
function setupWhatsAppElements(settings) {
  const waUrl = getWhatsAppUrl(settings.whatsapp, settings.waPesanAwal);
  document.querySelectorAll('.js-wa-link').forEach(btn => {
    btn.setAttribute('href', waUrl);
    btn.setAttribute('target', '_blank');
    btn.setAttribute('rel', 'noopener noreferrer');
  });

  const waNumbers = document.querySelectorAll('.js-wa-number');
  waNumbers.forEach(el => {
    el.textContent = settings.whatsapp;
  });
}

// Navbar Scroll Shrink
function setupNavbarScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Highlight menu yang aktif
function highlightActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link-x').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Back To Top Handler
function setupBackToTop() {
  const bttBtn = document.getElementById('backToTopBtn');
  if (!bttBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      bttBtn.classList.add('visible');
    } else {
      bttBtn.classList.remove('visible');
    }
  }, { passive: true });

  bttBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// WhatsApp Floating Popup
function setupWhatsAppPopup(settings) {
  const waBtn = document.getElementById('waFloatBtn');
  const waBox = document.getElementById('waPopupBox');
  const waClose = document.getElementById('waPopupClose');
  const waActionBtn = document.getElementById('waPopupActionBtn');

  if (!waBtn || !waBox) return;

  // Set action button URL
  if (waActionBtn) {
    waActionBtn.setAttribute('href', getWhatsAppUrl(settings.whatsapp, settings.waPesanAwal));
    waActionBtn.setAttribute('target', '_blank');
    waActionBtn.setAttribute('rel', 'noopener noreferrer');
  }

  // Toggle open
  waBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    waBox.classList.toggle('active');
  });

  // Close button
  if (waClose) {
    waClose.addEventListener('click', () => {
      waBox.classList.remove('active');
    });
  }

  // Click outside to close
  document.addEventListener('click', (e) => {
    if (!waBox.contains(e.target) && !waBtn.contains(e.target)) {
      waBox.classList.remove('active');
    }
  });

  // Esc key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      waBox.classList.remove('active');
    }
  });
}

// Sinkronisasi data footer
function populateFooterData(settings) {
  const addressEl = document.getElementById('footerAddress');
  if (addressEl && settings.alamat) addressEl.textContent = settings.alamat;

  const phoneEl = document.getElementById('footerPhone');
  if (phoneEl && settings.whatsapp) {
    phoneEl.textContent = settings.whatsapp;
    phoneEl.setAttribute('href', `tel:${settings.whatsapp.replace(/[^0-9+]/g, '')}`);
  }

  const emailEl = document.getElementById('footerEmail');
  if (emailEl && settings.email) {
    emailEl.textContent = settings.email;
    emailEl.setAttribute('href', `mailto:${settings.email}`);
  }

  const hoursEl = document.getElementById('footerHours');
  if (hoursEl && settings.jamOperasional) hoursEl.textContent = settings.jamOperasional;
}

// Injeksi JSON-LD LocalBusiness Schema
function injectLocalBusinessSchema(settings) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": settings.namaBisnis,
    "description": settings.seoDesc,
    "telephone": "+6282232730246",
    "email": settings.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings.alamat,
      "addressCountry": "ID"
    },
    "openingHours": "Mo-Fr 08:30-17:00, Sa 09:00-14:00",
    "sameAs": [
      settings.sosial?.instagram || "https://instagram.com/kenessouvenir"
    ]
  });
  document.head.appendChild(script);
}

