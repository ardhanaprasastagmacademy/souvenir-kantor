/**
 * HOME.JS — Logika Halaman Beranda
 * Memuat Hero, Tentang, Kenapa Pilih Kami, Produk Unggulan, Galeri, Testimoni, FAQ, dan CTA
 */

import { DataService } from './firebase-config.js';
import { getWhatsAppUrl, renderSkeletonCards } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Muat Konten Beranda dari Settings
  loadHomeSettings();

  // 2. Muat Produk Unggulan
  loadFeaturedProducts();

  // 3. Muat Galeri Terbaru
  loadHomeGallery();

  // 4. Muat Testimoni Slider
  loadTestimonials();

  // 5. Muat FAQ Accordion
  loadFaqs();
});

// 1. Muat Pengaturan Beranda
async function loadHomeSettings() {
  try {
    const homeSettings = await DataService.getDocument('settings/home');
    if (!homeSettings) return;

    // Hero
    if (homeSettings.hero) {
      const hTitle = document.getElementById('heroTitle');
      const hSub = document.getElementById('heroSubtitle');
      const hImg = document.getElementById('heroImg');
      if (hTitle && homeSettings.hero.judul) hTitle.textContent = homeSettings.hero.judul;
      if (hSub && homeSettings.hero.subjudul) hSub.textContent = homeSettings.hero.subjudul;
      if (hImg && homeSettings.hero.gambarUrl) hImg.src = homeSettings.hero.gambarUrl;
    }

    // Tentang Singkat
    if (homeSettings.about) {
      const abTitle = document.getElementById('homeAboutTitle');
      const abDesc = document.getElementById('homeAboutText');
      const abImg = document.getElementById('homeAboutImg');
      if (abTitle && homeSettings.about.judul) abTitle.textContent = homeSettings.about.judul;
      if (abDesc && homeSettings.about.teks) abDesc.textContent = homeSettings.about.teks;
      if (abImg && homeSettings.about.gambarUrl) abImg.src = homeSettings.about.gambarUrl;
    }

    // Kenapa Pilih Kami
    if (homeSettings.whyUs && Array.isArray(homeSettings.whyUs)) {
      const whyContainer = document.getElementById('whyUsContainer');
      if (whyContainer) {
        whyContainer.innerHTML = homeSettings.whyUs.map((item, idx) => `
          <div class="col-12 col-md-4 mb-4 mb-md-0">
            <div class="benefit-item">
              <span class="serif-number">${item.nomor || `0${idx + 1}`}</span>
              <h3>${item.judul}</h3>
              <p>${item.deskripsi}</p>
            </div>
          </div>
        `).join('');
      }
    }

    // CTA
    if (homeSettings.cta) {
      const ctaTitle = document.getElementById('homeCtaTitle');
      const ctaDesc = document.getElementById('homeCtaText');
      if (ctaTitle && homeSettings.cta.judul) ctaTitle.textContent = homeSettings.cta.judul;
      if (ctaDesc && homeSettings.cta.teks) ctaDesc.textContent = homeSettings.cta.teks;
    }
  } catch (err) {
    console.warn("Home settings load fallback:", err);
  }
}

// 2. Muat Produk Unggulan
async function loadFeaturedProducts() {
  const container = document.getElementById('featuredProductsContainer');
  if (!container) return;

  container.innerHTML = renderSkeletonCards(4);

  try {
    const products = await DataService.getCollection('products');
    const featured = products.filter(p => p.isActive && p.isFeatured).slice(0, 8);

    if (featured.length === 0) {
      container.innerHTML = `<div class="col-12 text-center py-4 text-muted-custom">Belum ada produk unggulan.</div>`;
      return;
    }

    container.innerHTML = featured.map(prod => {
      const waText = `Halo Kenes Souvenir, saya tertarik memesan produk "${prod.nama}". Mohon info penawaran harga & spesifikasinya.`;
      const waUrl = getWhatsAppUrl('082232730246', waText);
      return `
        <div class="col-6 col-lg-3 mb-4">
          <div class="product-card">
            <div class="product-card-img-wrap">
              <img src="${prod.gambarUrl}" alt="${prod.nama}" loading="lazy" width="300" height="375">
              <span class="product-card-badge">Unggulan</span>
            </div>
            <div class="product-card-body">
              <span class="product-card-category">${prod.kategoriNama || 'Souvenir'}</span>
              <a href="produk-detail.html?slug=${prod.slug}" class="product-card-title">${prod.nama}</a>
              <p class="product-card-desc">${prod.deskripsiSingkat || ''}</p>
              <div class="product-card-price">${prod.hargaMulai || 'Harga via Penawaran'}</div>
              <div class="product-card-actions">
                <a href="produk-detail.html?slug=${prod.slug}" class="btn-text-custom">Detail Produk</a>
                <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-text-custom" style="color:var(--orangered-600);">Pesan via WA</a>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error("Gagal memuat produk unggulan:", err);
    container.innerHTML = `<div class="col-12 text-center py-4 text-danger">Gagal memuat data produk. Silakan segarkan halaman.</div>`;
  }
}

// 3. Muat Galeri Terbaru di Beranda
async function loadHomeGallery() {
  const container = document.getElementById('homeGalleryContainer');
  if (!container) return;

  try {
    const galleryItems = await DataService.getCollection('gallery');
    const activeItems = galleryItems.filter(g => g.isActive).slice(0, 6);

    if (activeItems.length === 0) {
      container.innerHTML = `<div class="col-12 text-center py-4 text-muted-custom">Belum ada foto galeri.</div>`;
      return;
    }

    container.innerHTML = activeItems.map((item, idx) => `
      <div class="gallery-item ${idx % 3 === 0 ? 'tall' : ''}" data-index="${idx}" data-src="${item.gambarUrl}" data-caption="${item.judul}">
        <img src="${item.gambarUrl}" alt="${item.judul}" loading="lazy" width="400" height="400">
        <div class="gallery-caption-overlay">
          <div class="gallery-caption-category">${item.kategori || 'Portofolio'}</div>
          <div class="gallery-caption-title">${item.judul}</div>
        </div>
      </div>
    `).join('');

    setupHomeGalleryLightbox(activeItems);
  } catch (err) {
    console.error("Gagal memuat galeri:", err);
  }
}

// Setup Lightbox untuk Galeri
function setupHomeGalleryLightbox(items) {
  const lightbox = document.getElementById('galleryLightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCaption = document.getElementById('lightboxCaption');
  const lbClose = document.getElementById('lightboxClose');
  const lbPrev = document.getElementById('lightboxPrev');
  const lbNext = document.getElementById('lightboxNext');

  if (!lightbox) return;

  let currentIndex = 0;

  const showIndex = (index) => {
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;
    currentIndex = index;
    const current = items[currentIndex];
    lbImg.src = current.gambarUrl;
    lbCaption.textContent = current.judul;
    lightbox.classList.add('active');
  };

  document.querySelectorAll('#homeGalleryContainer .gallery-item').forEach((el) => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.getAttribute('data-index'), 10);
      showIndex(idx);
    });
  });

  if (lbClose) lbClose.addEventListener('click', () => lightbox.classList.remove('active'));
  if (lbPrev) lbPrev.addEventListener('click', (e) => { e.stopPropagation(); showIndex(currentIndex - 1); });
  if (lbNext) lbNext.addEventListener('click', (e) => { e.stopPropagation(); showIndex(currentIndex + 1); });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('active');
  });
}

// 4. Muat Testimoni Slider
async function loadTestimonials() {
  const quoteEl = document.getElementById('testiQuote');
  const authorEl = document.getElementById('testiAuthor');
  const companyEl = document.getElementById('testiCompany');
  const counterEl = document.getElementById('testiCounter');
  const prevBtn = document.getElementById('testiPrevBtn');
  const nextBtn = document.getElementById('testiNextBtn');

  if (!quoteEl) return;

  try {
    const list = await DataService.getCollection('testimonials');
    const activeTestis = list.filter(t => t.isActive);

    if (activeTestis.length === 0) return;

    let currentIndex = 0;

    const renderTesti = (index) => {
      const t = activeTestis[index];
      quoteEl.textContent = `“${t.isi}”`;
      authorEl.textContent = t.nama;
      companyEl.textContent = t.perusahaan;
      if (counterEl) {
        const currentStr = (index + 1).toString().padStart(2, '0');
        const totalStr = activeTestis.length.toString().padStart(2, '0');
        counterEl.textContent = `${currentStr} / ${totalStr}`;
      }
    };

    renderTesti(currentIndex);

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + activeTestis.length) % activeTestis.length;
        renderTesti(currentIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % activeTestis.length;
        renderTesti(currentIndex);
      });
    }
  } catch (err) {
    console.error("Gagal memuat testimoni:", err);
  }
}

// 5. Muat FAQ Accordion (+ and - toggle)
async function loadFaqs() {
  const container = document.getElementById('faqContainer');
  if (!container) return;

  try {
    const faqs = await DataService.getCollection('faqs');
    const activeFaqs = faqs.filter(f => f.isActive).sort((a, b) => a.urutan - b.urutan);

    if (activeFaqs.length === 0) return;

    container.innerHTML = activeFaqs.map((faq, idx) => `
      <div class="faq-item ${idx === 0 ? 'active' : ''}">
        <button type="button" class="faq-question" aria-expanded="${idx === 0 ? 'true' : 'false'}">
          <span>${faq.pertanyaan}</span>
          <span class="faq-toggle-icon">${idx === 0 ? '−' : '+'}</span>
        </button>
        <div class="faq-answer">
          ${faq.jawaban}
        </div>
      </div>
    `).join('');

    // Toggle event
    container.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isActive = item.classList.contains('active');

        // Tutup yang lain jika ingin single accordion
        container.querySelectorAll('.faq-item').forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            other.querySelector('.faq-toggle-icon').textContent = '+';
            other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });

        if (isActive) {
          item.classList.remove('active');
          item.querySelector('.faq-toggle-icon').textContent = '+';
          btn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          item.querySelector('.faq-toggle-icon').textContent = '−';
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // Injeksi FAQPage Schema untuk SEO
    injectFaqSchema(activeFaqs);
  } catch (err) {
    console.error("Gagal memuat FAQ:", err);
  }
}

function injectFaqSchema(faqs) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.pertanyaan,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.jawaban
      }
    }))
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

