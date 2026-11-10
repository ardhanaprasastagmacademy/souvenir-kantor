/**
 * PRODUK-DETAIL.JS — Halaman Detail Produk Dedicated (produk-detail.html?slug=...)
 * Memenuhi Pilar Teknis SEO-STRATEGY.md: URL mandiri yang dapat diindeks, tabel spesifikasi kaya, schema Product
 */

import { DataService } from './firebase-config.js';
import { getWhatsAppUrl } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  if (!slug) {
    showNotFoundState();
    return;
  }

  await loadProductDetail(slug);
});

async function loadProductDetail(slug) {
  const container = document.getElementById('productDetailContainer');
  const notFoundEl = document.getElementById('productNotFound');

  try {
    const products = await DataService.getCollection('products');
    const product = products.find(p => p.slug === slug || p.id === slug);

    if (!product) {
      showNotFoundState();
      return;
    }

    if (notFoundEl) notFoundEl.style.display = 'none';
    if (container) container.style.display = 'block';

    // 1. Update Title & Meta Tags
    document.title = `${product.nama} Custom Logo | Kenes Souvenir Kantor`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', `${product.nama}: ${product.deskripsiSingkat || ''} Minimal order ${product.spesifikasi?.minOrder || '50 pcs'}. Hubungi WhatsApp 082232730246.`);
    }

    // 2. Breadcrumbs
    const bcCat = document.getElementById('bcCategory');
    const bcCurrent = document.getElementById('bcCurrentProduct');
    if (bcCat) {
      bcCat.textContent = product.kategoriNama || 'Katalog';
      bcCat.href = `produk.html?kategori=${product.kategoriId || ''}`;
    }
    if (bcCurrent) {
      bcCurrent.textContent = product.nama;
    }

    // 3. Info Dasar
    const titleEl = document.getElementById('prodDetailTitle');
    const catEl = document.getElementById('prodDetailCategory');
    const priceEl = document.getElementById('prodDetailPrice');
    const descEl = document.getElementById('prodDetailDesc');
    const imgEl = document.getElementById('prodDetailImg');

    if (titleEl) titleEl.textContent = product.nama;
    if (catEl) catEl.textContent = product.kategoriNama || 'Souvenir Kantor';
    if (priceEl) priceEl.textContent = product.hargaMulai || 'Harga via Penawaran Resmi';
    if (descEl) descEl.textContent = product.deskripsi || product.deskripsiSingkat || '';
    if (imgEl) {
      imgEl.src = product.gambarUrl;
      imgEl.alt = `${product.nama} custom logo perusahaan`;
    }

    // 4. WhatsApp CTA Buttons
    const waText = `Halo Kenes Souvenir, saya tertarik memesan produk "${product.nama}". Mohon informasi harga untuk kuantiti [isi jumlah] pcs dan simulasi mockup logo.`;
    const waUrl = getWhatsAppUrl('082232730246', waText);
    const waBtn = document.getElementById('prodDetailWaBtn');
    if (waBtn) waBtn.href = waUrl;

    // 5. Tabel Spesifikasi Kaya (Pilar AEO/GEO SEO)
    const specTbody = document.getElementById('prodSpecTbody');
    if (specTbody) {
      const spec = product.spesifikasi || {};
      const rows = [
        { k: "Bahan Baku", v: spec.bahan || "Material industri pilihan" },
        { k: "Ukuran / Kapasitas", v: spec.kapasitas || "Standar korporat" },
        { k: "Pilihan Warna", v: spec.warna || "Dapat disesuaikan brand guidelines" },
        { k: "Metode Cetak Logo", v: spec.teknikCetak || "Laser Engraving / Sablon Presisi / Emboss" },
        { k: "Minimal Pemesanan (MOQ)", v: spec.minOrder || "50 pcs" },
        { k: "Estimasi Waktu Produksi", v: spec.waktuProduksi || "5 – 8 hari kerja" },
        { k: "Jenis Kemasan", v: spec.kemasan || "Individual box / Custom hardbox magnetik" }
      ];

      specTbody.innerHTML = rows.map(r => `
        <tr>
          <th>${r.k}</th>
          <td>${r.v}</td>
        </tr>
      `).join('');
    }

    // 6. FAQ Produk
    const faqContainer = document.getElementById('prodFaqContainer');
    if (faqContainer) {
      const faqs = product.faqs && product.faqs.length > 0 ? product.faqs : [
        { q: `Berapa lama proses pembuatan sampel untuk ${product.nama}?`, a: "Simulasi visual digital kami selesaikan gratis dalam 1 hari kerja. Pembuatan sampel fisik memerlukan waktu 3-5 hari kerja." },
        { q: "Apakah bisa dikirim ke luar kota atau luar pulau?", a: "Bisa, kami melayani pengiriman via kargo darat, laut, dan udara ke seluruh penjuru Indonesia dengan asuransi pengiriman." }
      ];

      faqContainer.innerHTML = faqs.map((f, i) => `
        <div class="faq-item ${i === 0 ? 'active' : ''}">
          <button type="button" class="faq-question">
            <span>${f.q}</span>
            <span class="faq-toggle-icon">${i === 0 ? '−' : '+'}</span>
          </button>
          <div class="faq-answer">${f.a}</div>
        </div>
      `).join('');

      faqContainer.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
          const item = btn.closest('.faq-item');
          item.classList.toggle('active');
          const isAct = item.classList.contains('active');
          item.querySelector('.faq-toggle-icon').textContent = isAct ? '−' : '+';
        });
      });
    }

    // 7. Produk Terkait
    loadRelatedProducts(products, product);

    // 8. Injeksi JSON-LD Product Schema
    injectProductSchema(product);

  } catch (err) {
    console.error("Error load product detail:", err);
    showNotFoundState();
  }
}

function loadRelatedProducts(allProducts, current) {
  const container = document.getElementById('relatedProductsContainer');
  if (!container) return;

  const related = allProducts
    .filter(p => p.id !== current.id && p.isActive && (p.kategoriId === current.kategoriId || p.isFeatured))
    .slice(0, 4);

  if (related.length === 0) {
    container.parentElement.style.display = 'none';
    return;
  }

  container.innerHTML = related.map(prod => `
    <div class="col-6 col-md-3 mb-4">
      <div class="product-card">
        <div class="product-card-img-wrap">
          <img src="${prod.gambarUrl}" alt="${prod.nama}" loading="lazy" width="300" height="375">
        </div>
        <div class="product-card-body">
          <span class="product-card-category">${prod.kategoriNama || 'Souvenir'}</span>
          <a href="produk-detail.html?slug=${prod.slug}" class="product-card-title" style="font-size:1.1rem;">${prod.nama}</a>
          <div class="product-card-price" style="font-size:0.875rem;">${prod.hargaMulai || 'Harga via Penawaran'}</div>
          <div class="product-card-actions">
            <a href="produk-detail.html?slug=${prod.slug}" class="btn-text-custom">Detail Produk</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function showNotFoundState() {
  const container = document.getElementById('productDetailContainer');
  const notFoundEl = document.getElementById('productNotFound');
  if (container) container.style.display = 'none';
  if (notFoundEl) notFoundEl.style.display = 'block';
}

function injectProductSchema(product) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.nama,
    "image": [product.gambarUrl],
    "description": product.deskripsi || product.deskripsiSingkat,
    "brand": {
      "@type": "Brand",
      "name": "Kenes Souvenir"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "IDR",
      "price": "50000",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Kenes Souvenir"
      }
    }
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

