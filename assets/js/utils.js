/**
 * UTILS.JS — Helper Functions untuk Website Souvenir Kantor
 */

// Format Rupiah (misal: Rp 35.000 / pcs)
export function formatRupiah(angka) {
  if (angka === null || angka === undefined || angka === '') return '';
  const num = typeof angka === 'string' ? parseInt(angka.replace(/[^0-9]/g, ''), 10) : angka;
  if (isNaN(num)) return '';
  return 'Rp ' + num.toLocaleString('id-ID');
}

// Format Tanggal Indonesia (misal: 12 November 2026)
export function formatTanggalIndo(dateInput) {
  if (!dateInput) return '';
  const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
  if (isNaN(date.getTime())) return dateInput;
  
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
}

// Slug generator
export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Generate link WhatsApp dengan teks otomatis
export function getWhatsAppUrl(phone = '082232730246', text = '') {
  let cleanPhone = phone.toString().replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.substring(1);
  }
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

// Sanitasi HTML menggunakan DOMPurify jika ada
export function sanitizeHTML(dirty) {
  if (typeof window !== 'undefined' && window.DOMPurify) {
    return window.DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'br', 'span', 'img'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class']
    });
  }
  // Fallback sederhana jika DOMPurify belum siap
  const div = document.createElement('div');
  div.textContent = dirty;
  return div.innerHTML;
}

// Strip HTML tags
export function stripHtml(html) {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

// Toast notification helper
export function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:24px;left:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bg = type === 'success' ? '#231B16' : '#D93A00';
  const border = type === 'success' ? '#E4D6BE' : '#FF4500';
  toast.style.cssText = `background:${bg};color:#FFFBF3;border:1px solid ${border};padding:12px 20px;border-radius:2px;font-size:0.875rem;box-shadow:0 4px 12px rgba(0,0,0,0.15);animation:fadeIn 0.2s ease;display:flex;align-items:center;gap:12px;`;
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Render Skeleton Card Placeholder
export function renderSkeletonCards(count = 4) {
  return Array.from({ length: count }, () => `
    <div class="col-6 col-md-4 col-lg-3">
      <div class="product-card skeleton-card">
        <div class="product-card-img-wrap skeleton" style="aspect-ratio:4/5;"></div>
        <div class="product-card-body">
          <div class="skeleton" style="width:40%;height:12px;margin-bottom:8px;"></div>
          <div class="skeleton" style="width:80%;height:20px;margin-bottom:12px;"></div>
          <div class="skeleton" style="width:60%;height:14px;margin-top:auto;"></div>
        </div>
      </div>
    </div>
  `).join('');
}

// Kompresi gambar via Canvas di sisi klien agar cepat & hemat kapasitas (aman di Firestore & LocalStore)
export async function compressImage(file, maxWidth = 900, maxHeight = 900, quality = 0.75) {
  return new Promise((resolve) => {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      resolve(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}


