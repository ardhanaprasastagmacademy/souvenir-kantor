/**
 * BLOG-DETAIL.JS — Detail Artikel Blog (blog-detail.html?slug=...)
 * Memuat artikel, sanitasi DOMPurify, share buttons, artikel terkait, dan JSON-LD Article
 */

import { DataService } from './firebase-config.js';
import { formatTanggalIndo, sanitizeHTML, showToast } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  if (!slug) {
    showNotFoundState();
    return;
  }

  await loadArticle(slug);
});

async function loadArticle(slug) {
  const container = document.getElementById('articleContainer');
  const notFoundEl = document.getElementById('articleNotFound');

  try {
    const posts = await DataService.getCollection('posts');
    const post = posts.find(p => p.slug === slug || p.id === slug);

    if (!post || post.status !== 'published') {
      showNotFoundState();
      return;
    }

    if (notFoundEl) notFoundEl.style.display = 'none';
    if (container) container.style.display = 'block';

    // 1. Update Title & Meta
    document.title = `${post.metaTitle || post.judul} | Kenes Souvenir`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', post.metaDesc || post.ringkasan || '');
    }

    // 2. Breadcrumb
    const bcTitle = document.getElementById('bcArticleTitle');
    if (bcTitle) bcTitle.textContent = post.judul;

    // 3. Render Header Artikel
    const titleEl = document.getElementById('articleTitle');
    const authorEl = document.getElementById('articleAuthor');
    const dateEl = document.getElementById('articleDate');
    const thumbImg = document.getElementById('articleThumbImg');
    const bodyEl = document.getElementById('articleBody');

    if (titleEl) titleEl.textContent = post.judul;
    if (authorEl) authorEl.textContent = post.penulis || 'Tim Kenes Souvenir';
    if (dateEl) dateEl.textContent = formatTanggalIndo(post.tanggalTerbit || post.createdAt);
    if (thumbImg) {
      thumbImg.src = post.thumbnailUrl || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80';
      thumbImg.alt = post.judul;
    }

    // 4. Render Sanitized Body
    if (bodyEl) {
      bodyEl.innerHTML = sanitizeHTML(post.konten);
    }

    // 5. Setup Share Buttons
    setupShareButtons(post);

    // 6. Muat Artikel Terkait (3 item)
    loadRelatedPosts(posts, post);

    // 7. Injeksi JSON-LD Article Schema
    injectArticleSchema(post);

  } catch (err) {
    console.error("Error memuat detail artikel:", err);
    showNotFoundState();
  }
}

function setupShareButtons(post) {
  const pageUrl = window.location.href;
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(post.judul);

  const shareWa = document.getElementById('shareWa');
  const shareTw = document.getElementById('shareTwitter');
  const shareFb = document.getElementById('shareFacebook');
  const copyBtn = document.getElementById('copyArticleLink');

  if (shareWa) shareWa.href = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
  if (shareTw) shareTw.href = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  if (shareFb) shareFb.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  if (copyBtn) {
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(pageUrl).then(() => {
        showToast("Tautan artikel berhasil disalin ke papan klip!", "success");
      });
    });
  }
}

function loadRelatedPosts(allPosts, current) {
  const container = document.getElementById('relatedPostsContainer');
  if (!container) return;

  const related = allPosts
    .filter(p => p.id !== current.id && p.status === 'published')
    .slice(0, 3);

  if (related.length === 0) {
    container.parentElement.style.display = 'none';
    return;
  }

  container.innerHTML = related.map(p => `
    <div class="col-12 col-md-4 mb-4">
      <article class="blog-card">
        <a href="blog-detail.html?slug=${p.slug}" class="blog-card-img-wrap">
          <img src="${p.thumbnailUrl}" alt="${p.judul}" loading="lazy" width="400" height="250">
        </a>
        <div class="blog-card-body">
          <div class="blog-card-meta">
            <span>${formatTanggalIndo(p.tanggalTerbit || p.createdAt)}</span>
          </div>
          <a href="blog-detail.html?slug=${p.slug}" class="blog-card-title" style="font-size:1.15rem;">${p.judul}</a>
          <p class="blog-card-summary" style="font-size:0.85rem;">${p.ringkasan || ''}</p>
        </div>
      </article>
    </div>
  `).join('');
}

function showNotFoundState() {
  const container = document.getElementById('articleContainer');
  const notFoundEl = document.getElementById('articleNotFound');
  if (container) container.style.display = 'none';
  if (notFoundEl) notFoundEl.style.display = 'block';
}

function injectArticleSchema(post) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.judul,
    "description": post.metaDesc || post.ringkasan,
    "image": [post.thumbnailUrl],
    "datePublished": post.tanggalTerbit || post.createdAt,
    "dateModified": post.updatedAt || post.tanggalTerbit || post.createdAt,
    "author": {
      "@type": "Person",
      "name": post.penulis || "Tim Redaksi Kenes Souvenir"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Kenes Souvenir",
      "logo": {
        "@type": "ImageObject",
        "url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"
      }
    }
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

