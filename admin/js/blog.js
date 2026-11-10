/**
 * BLOG.JS — Kelola Artikel Blog di Admin (admin/blog.html)
 * Dilengkapi Rich Text Editor Quill, Slug Otomatis, dan Pratinjau SERP Google
 */

import { DataService } from '../../assets/js/firebase-config.js';
import { slugify, formatTanggalIndo, showToast } from '../../assets/js/utils.js';

let allPosts = [];
let editingPostId = null;
let quillEditor = null;

document.addEventListener('DOMContentLoaded', async () => {
  initQuill();
  await loadPosts();
  setupEventListeners();
});

function initQuill() {
  const editorEl = document.getElementById('quillEditor');
  if (editorEl && window.Quill) {
    quillEditor = new window.Quill(editorEl, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ 'header': [2, 3, false] }],
          ['bold', 'italic', 'underline', 'blockquote'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['link', 'clean']
        ]
      }
    });
  }
}

async function loadPosts() {
  const tbody = document.getElementById('blogTbody');
  if (!tbody) return;

  try {
    allPosts = await DataService.getCollection('posts');
    allPosts.sort((a, b) => new Date(b.tanggalTerbit || b.createdAt) - new Date(a.tanggalTerbit || a.createdAt));

    if (allPosts.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted-custom">Belum ada artikel blog.</td></tr>`;
      return;
    }

    tbody.innerHTML = allPosts.map(post => `
      <tr>
        <td>
          <img src="${post.thumbnailUrl || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=300&q=80'}" alt="${post.judul}" class="table-thumb" loading="lazy">
        </td>
        <td>
          <strong>${post.judul}</strong><br>
          <small class="text-muted-custom">/${post.slug}</small>
        </td>
        <td>
          ${post.status === 'published' ? '<span class="badge-status badge-active">Published</span>' : '<span class="badge-status badge-inactive">Draft</span>'}
        </td>
        <td>${post.penulis || 'Redaksi'}</td>
        <td class="small text-muted-custom">${formatTanggalIndo(post.tanggalTerbit || post.createdAt)}</td>
        <td>
          <a href="#" class="action-link action-link-edit js-edit-post" data-id="${post.id}">Ubah</a>
          <a href="#" class="action-link action-link-delete js-delete-post" data-id="${post.id}" data-title="${post.judul}">Hapus</a>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.js-edit-post').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openEditModal(btn.getAttribute('data-id'));
      });
    });

    tbody.querySelectorAll('.js-delete-post').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        handleDeletePost(btn.getAttribute('data-id'), btn.getAttribute('data-title'));
      });
    });
  } catch (err) {
    console.error("Gagal load blog:", err);
  }
}

function setupEventListeners() {
  document.getElementById('btnOpenAddPost')?.addEventListener('click', () => {
    editingPostId = null;
    document.getElementById('postForm')?.reset();
    if (quillEditor) quillEditor.root.innerHTML = '';
    document.getElementById('postModalTitle').textContent = 'Tulis Artikel Baru';
    document.getElementById('postDateInput').value = new Date().toISOString().split('T')[0];
    updateSerpPreview();
    const modal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('postModal'));
    modal.show();
  });

  // Auto slug
  const titleInput = document.getElementById('postTitleInput');
  const slugInput = document.getElementById('postSlugInput');
  if (titleInput && slugInput) {
    titleInput.addEventListener('input', () => {
      if (!editingPostId) {
        slugInput.value = slugify(titleInput.value);
        updateSerpPreview();
      }
    });
  }

  // Live SERP Preview updates
  document.getElementById('postMetaTitleInput')?.addEventListener('input', updateSerpPreview);
  document.getElementById('postMetaDescInput')?.addEventListener('input', updateSerpPreview);
  slugInput?.addEventListener('input', updateSerpPreview);

  document.getElementById('postForm')?.addEventListener('submit', handlePostSubmit);
}

function updateSerpPreview() {
  const title = document.getElementById('postMetaTitleInput')?.value || document.getElementById('postTitleInput')?.value || 'Judul Artikel';
  const slug = document.getElementById('postSlugInput')?.value || 'slug-artikel';
  const desc = document.getElementById('postMetaDescInput')?.value || document.getElementById('postSummaryInput')?.value || 'Deskripsi ringkas artikel untuk mesin pencari Google.';

  const previewTitle = document.getElementById('serpPreviewTitle');
  const previewUrl = document.getElementById('serpPreviewUrl');
  const previewDesc = document.getElementById('serpPreviewDesc');

  if (previewTitle) previewTitle.textContent = `${title} | Kenes Souvenir`;
  if (previewUrl) previewUrl.textContent = `https://kenessouvenir.com/blog-detail.html?slug=${slug}`;
  if (previewDesc) previewDesc.textContent = desc;

  // Character counts
  const titleCount = document.getElementById('metaTitleCount');
  const descCount = document.getElementById('metaDescCount');
  if (titleCount) titleCount.textContent = `${title.length}/60 karakter`;
  if (descCount) descCount.textContent = `${desc.length}/155 karakter`;
}

function openEditModal(postId) {
  editingPostId = postId;
  const p = allPosts.find(item => item.id === postId);
  if (!p) return;

  document.getElementById('postModalTitle').textContent = 'Ubah Artikel: ' + p.judul;
  document.getElementById('postTitleInput').value = p.judul || '';
  document.getElementById('postSlugInput').value = p.slug || '';
  document.getElementById('postSummaryInput').value = p.ringkasan || '';
  document.getElementById('postAuthorInput').value = p.penulis || '';
  document.getElementById('postThumbUrlInput').value = p.thumbnailUrl || '';
  document.getElementById('postStatusSelect').value = p.status || 'published';
  document.getElementById('postDateInput').value = p.tanggalTerbit || '';

  // Rich text
  if (quillEditor) {
    quillEditor.root.innerHTML = p.konten || '';
  }

  // SEO
  document.getElementById('postMetaTitleInput').value = p.metaTitle || '';
  document.getElementById('postMetaDescInput').value = p.metaDesc || '';

  updateSerpPreview();

  const modal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('postModal'));
  modal.show();
}

async function handlePostSubmit(e) {
  e.preventDefault();
  const submitBtn = document.getElementById('btnSavePost');
  submitBtn.disabled = true;

  let finalThumb = document.getElementById('postThumbUrlInput').value.trim();
  const fileInput = document.getElementById('postThumbFileInput');
  if (fileInput.files.length > 0) {
    const uploaded = await DataService.uploadImage(fileInput.files[0], 'blog');
    finalThumb = uploaded.url;
  }

  if (!finalThumb) {
    finalThumb = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80';
  }

  const judul = document.getElementById('postTitleInput').value.trim();
  const slug = document.getElementById('postSlugInput').value.trim() || slugify(judul);
  const ringkasan = document.getElementById('postSummaryInput').value.trim();
  const konten = quillEditor ? quillEditor.root.innerHTML : '';
  const penulis = document.getElementById('postAuthorInput').value.trim() || 'Tim Editorial Kenes Souvenir';
  const status = document.getElementById('postStatusSelect').value;
  const tanggalTerbit = document.getElementById('postDateInput').value;
  const metaTitle = document.getElementById('postMetaTitleInput').value.trim();
  const metaDesc = document.getElementById('postMetaDescInput').value.trim();

  const payload = {
    judul,
    slug,
    ringkasan,
    konten,
    thumbnailUrl: finalThumb,
    penulis,
    status,
    tanggalTerbit,
    metaTitle,
    metaDesc
  };

  try {
    if (editingPostId) {
      await DataService.updateDocument('posts', editingPostId, payload);
      showToast('Artikel berhasil diperbarui.', 'success');
    } else {
      await DataService.addDocument('posts', payload);
      showToast('Artikel baru berhasil diterbitkan.', 'success');
    }

    const modal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('postModal'));
    modal.hide();
    await loadPosts();
  } catch (err) {
    console.error("Gagal simpan artikel:", err);
    alert("Terjadi kesalahan saat menyimpan artikel.");
  } finally {
    submitBtn.disabled = false;
  }
}

async function handleDeletePost(id, title) {
  if (confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) {
    try {
      await DataService.deleteDocument('posts', id);
      showToast('Artikel berhasil dihapus.', 'success');
      await loadPosts();
    } catch (err) {
      console.error("Gagal hapus artikel:", err);
      alert("Gagal menghapus artikel.");
    }
  }
}

