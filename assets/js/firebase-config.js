/**
 * FIREBASE-CONFIG.JS — Adapter Database & Autentikasi untuk Website Souvenir Kantor
 * Mendukung Firebase v10 Modular & Seamless Local Store Engine (dengan Seed Data)
 */

import {
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_GALLERY,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQS,
  INITIAL_POSTS,
  INITIAL_MESSAGES
} from './seed-data.js';
import { compressImage } from './utils.js';

// Kunci penyimpanan lokal
const STORAGE_PREFIX = 'kenes_souvenir_';

// Deteksi konfigurasi Firebase kustom jika disimpan oleh admin
const savedConfig = localStorage.getItem('kenes_firebase_config');
export const FIREBASE_CONFIG = savedConfig ? JSON.parse(savedConfig) : (window.FIREBASE_CONFIG || {
  apiKey: "AIzaSyASQi4uIE1eOn7iiGJwt9clR2pChfvpQQc",
  authDomain: "kenes-souvenir.firebaseapp.com",
  projectId: "kenes-souvenir",
  storageBucket: "kenes-souvenir.firebasestorage.app",
  messagingSenderId: "858139499546",
  appId: "1:858139499546:web:ff6395be9d237d8e83c5a3"
});

export const isFirebaseActive = Boolean(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId && !FIREBASE_CONFIG.apiKey.startsWith("YOUR_"));

// State inisialisasi Firebase
let firebaseApp = null;
let firestoreDb = null;
let firebaseAuth = null;
let firebaseStorage = null;
let initPromise = null;

async function ensureFirebaseInitialized() {
  if (!isFirebaseActive) return null;
  if (firestoreDb) return { firebaseApp, firestoreDb, firebaseAuth, firebaseStorage };

  if (!initPromise) {
    initPromise = (async () => {
      try {
        const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
        const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
        const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
        const { getStorage } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js');

        const apps = getApps();
        firebaseApp = apps.length > 0 ? apps[0] : initializeApp(FIREBASE_CONFIG);
        firestoreDb = getFirestore(firebaseApp);
        firebaseAuth = getAuth(firebaseApp);
        firebaseStorage = getStorage(firebaseApp);

        console.log("Firebase berhasil terhubung:", FIREBASE_CONFIG.projectId);
        return { firebaseApp, firestoreDb, firebaseAuth, firebaseStorage };
      } catch (err) {
        console.warn("[Firebase] Gagal inisialisasi, beralih ke LocalStore:", err);
        return null;
      }
    })();
  }

  return initPromise;
}

// =========================================================================
// LOCAL STORE ENGINE (Fallback cerdas & instan saat Firebase belum dikonfigurasi)
// =========================================================================

function getLocalStore(key) {
  const data = localStorage.getItem(STORAGE_PREFIX + key);
  return data ? JSON.parse(data) : null;
}

function setLocalStore(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[LocalStore] Gagal menyimpan ${key} ke LocalStorage (mungkin melebihi kuota):`, err);
  }
}

// Inisialisasi data awal lokal jika masih kosong
export function initLocalDatabase(force = false) {
  if (force || !getLocalStore('initialized')) {
    setLocalStore('settings_general', INITIAL_SETTINGS.general);
    setLocalStore('settings_home', INITIAL_SETTINGS.home);
    setLocalStore('settings_about', INITIAL_SETTINGS.about);
    setLocalStore('settings_banners', INITIAL_SETTINGS.banners);
    setLocalStore('categories', INITIAL_CATEGORIES);
    setLocalStore('products', INITIAL_PRODUCTS);
    setLocalStore('gallery', INITIAL_GALLERY);
    setLocalStore('testimonials', INITIAL_TESTIMONIALS);
    setLocalStore('faqs', INITIAL_FAQS);
    setLocalStore('posts', INITIAL_POSTS);
    setLocalStore('messages', INITIAL_MESSAGES);
    setLocalStore('initialized', true);
  }
}

// Jalankan inisialisasi lokal sekali di awal
initLocalDatabase();

// Inisialisasi Firebase jika aktif
if (isFirebaseActive) {
  ensureFirebaseInitialized();
}

// =========================================================================
// UNIFIED DATABASE API (Digunakan seragam oleh halaman publik & admin)
// =========================================================================

export const DataService = {
  // Ambil koleksi dokumen
  async getCollection(collectionName, options = {}) {
    await ensureFirebaseInitialized();

    // 1. Coba Firebase Firestore jika aktif
    if (isFirebaseActive && firestoreDb) {
      try {
        const { collection, getDocs, query, where, orderBy } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
        let q = collection(firestoreDb, collectionName);
        if (options.where) {
          q = query(q, where(options.where[0], options.where[1], options.where[2]));
        }
        if (options.orderBy) {
          q = query(q, orderBy(options.orderBy[0], options.orderBy[1] || 'asc'));
        }
        const snapshot = await getDocs(q);
        const docs = [];
        snapshot.forEach(doc => docs.push({ ...doc.data(), id: doc.id }));
        return docs;
      } catch (err) {
        console.warn(`[DataService] Firestore error on ${collectionName}, fallback to LocalStore:`, err);
      }
    }

    // 2. Fallback ke LocalStore
    let items = getLocalStore(collectionName) || [];
    if (options.where) {
      const [field, op, val] = options.where;
      items = items.filter(item => {
        if (op === '==') return item[field] === val;
        if (op === '!=') return item[field] !== val;
        return true;
      });
    }
    if (options.orderBy) {
      const [field, direction] = options.orderBy;
      items.sort((a, b) => {
        if (direction === 'desc') return (b[field] > a[field] ? 1 : -1);
        return (a[field] > b[field] ? 1 : -1);
      });
    }
    return items;
  },

  // Ambil single dokumen
  async getDocument(collectionName, docId) {
    await ensureFirebaseInitialized();

    if (collectionName.startsWith('settings/')) {
      const sub = collectionName.split('/')[1];

      if (isFirebaseActive && firestoreDb) {
        try {
          const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
          const docRef = doc(firestoreDb, 'settings', sub);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            return snap.data();
          }
        } catch (err) {
          console.warn(`[DataService] Firestore getSettings error:`, err);
        }
      }

      const settings = getLocalStore('settings_' + sub);
      return settings || null;
    }

    if (isFirebaseActive && firestoreDb) {
      try {
        const { doc, getDoc, collection, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
        const docRef = doc(firestoreDb, collectionName, docId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          return { ...snap.data(), id: snap.id };
        }

        // Coba cari berdasarkan field 'slug' atau 'id'
        const qSlug = query(collection(firestoreDb, collectionName), where('slug', '==', docId));
        const snapSlug = await getDocs(qSlug);
        if (!snapSlug.empty) {
          const d = snapSlug.docs[0];
          return { ...d.data(), id: d.id };
        }

        const qId = query(collection(firestoreDb, collectionName), where('id', '==', docId));
        const snapId = await getDocs(qId);
        if (!snapId.empty) {
          const d = snapId.docs[0];
          return { ...d.data(), id: d.id };
        }
      } catch (err) {
        console.warn(`[DataService] Firestore getDocument error:`, err);
      }
    }

    const items = getLocalStore(collectionName) || [];
    return items.find(item => item.id === docId || item.slug === docId) || null;
  },

  // Tambah dokumen baru
  async addDocument(collectionName, data) {
    await ensureFirebaseInitialized();

    let newDoc = { ...data, createdAt: data.createdAt || new Date().toISOString() };
    let firestoreError = null;

    if (isFirebaseActive && firestoreDb) {
      try {
        const { collection, doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
        // Pastikan docRef id dan data.id sama persis agar docId selalu sinkron
        const docRef = data.id 
          ? doc(firestoreDb, collectionName, data.id) 
          : doc(collection(firestoreDb, collectionName));
        
        newDoc.id = docRef.id;
        await setDoc(docRef, newDoc);
      } catch (err) {
        console.error(`[DataService] Firestore add error on ${collectionName}:`, err);
        firestoreError = err;
      }
    } else {
      if (!newDoc.id) {
        newDoc.id = 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
      }
    }

    const items = getLocalStore(collectionName) || [];
    items.unshift(newDoc);
    setLocalStore(collectionName, items);

    if (firestoreError && firestoreError.code === 'permission-denied') {
      throw new Error("Izin ditolak oleh Cloud Firestore (Missing or insufficient permissions). Pastikan aturan keamanan (Security Rules) di Firebase Console mengizinkan penulisan.");
    }

    return newDoc;
  },

  // Simpan / update dokumen
  async updateDocument(collectionName, docId, updates) {
    await ensureFirebaseInitialized();

    if (collectionName.startsWith('settings/')) {
      const sub = collectionName.split('/')[1];

      let firestoreError = null;
      if (isFirebaseActive && firestoreDb) {
        try {
          const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
          await setDoc(doc(firestoreDb, 'settings', sub), updates, { merge: true });
        } catch (err) {
          console.error(`[DataService] Firestore updateSettings error:`, err);
          firestoreError = err;
        }
      }

      const current = getLocalStore('settings_' + sub) || {};
      const merged = { ...current, ...updates };
      setLocalStore('settings_' + sub, merged);

      if (firestoreError && firestoreError.code === 'permission-denied') {
        throw new Error("Izin ditolak Cloud Firestore (Rules permission-denied).");
      }

      return merged;
    }

    let firestoreError = null;
    if (isFirebaseActive && firestoreDb) {
      try {
        const { doc, updateDoc, collection, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
        try {
          await updateDoc(doc(firestoreDb, collectionName, docId), updates);
        } catch (updateErr) {
          // Fallback jika docId adalah field 'id' internal lama
          const qId = query(collection(firestoreDb, collectionName), where('id', '==', docId));
          const snapId = await getDocs(qId);
          if (!snapId.empty) {
            for (const d of snapId.docs) {
              await updateDoc(d.ref, updates);
            }
          } else {
            throw updateErr;
          }
        }
      } catch (err) {
        console.error(`[DataService] Firestore update error on ${collectionName}:`, err);
        firestoreError = err;
      }
    }

    const items = getLocalStore(collectionName) || [];
    const index = items.findIndex(item => item.id === docId);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
      setLocalStore(collectionName, items);
    }

    if (firestoreError && firestoreError.code === 'permission-denied') {
      throw new Error("Izin ditolak Cloud Firestore (Rules permission-denied).");
    }

    return items[index] || null;
  },

  // Hapus dokumen
  async deleteDocument(collectionName, docId) {
    await ensureFirebaseInitialized();

    let firestoreError = null;
    if (isFirebaseActive && firestoreDb) {
      try {
        const { doc, deleteDoc, collection, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
        
        // 1. Hapus berdasarkan docId langsung
        await deleteDoc(doc(firestoreDb, collectionName, docId));

        // 2. Hapus juga jika ada dokumen dengan field `id == docId` (membersihkan produk yang sempat tersimpan dengan id_...)
        const qId = query(collection(firestoreDb, collectionName), where('id', '==', docId));
        const snapId = await getDocs(qId);
        for (const d of snapId.docs) {
          await deleteDoc(d.ref);
        }

        // 3. Jika docId berupa slug, hapus juga jika ada dokumen dengan slug tersebut
        const qSlug = query(collection(firestoreDb, collectionName), where('slug', '==', docId));
        const snapSlug = await getDocs(qSlug);
        for (const d of snapSlug.docs) {
          await deleteDoc(d.ref);
        }
      } catch (err) {
        console.error(`[DataService] Firestore delete error on ${collectionName}:`, err);
        firestoreError = err;
      }
    }

    let items = getLocalStore(collectionName) || [];
    items = items.filter(item => item.id !== docId && item.slug !== docId);
    setLocalStore(collectionName, items);

    if (firestoreError && firestoreError.code === 'permission-denied') {
      throw new Error("Izin ditolak Cloud Firestore (Rules permission-denied).");
    }

    return true;
  },

  // Upload gambar (Firebase Storage dengan fallback otomatis kompresi DataURL aman)
  async uploadImage(file, path = 'uploads') {
    await ensureFirebaseInitialized();

    // 1. Kompres gambar di browser (maks 900px, 75% JPEG) agar file berukuran sangat kecil (~50KB)
    let compressedDataUrl = '';
    try {
      compressedDataUrl = await compressImage(file, 900, 900, 0.75);
    } catch (err) {
      console.warn("[DataService] Gagal kompresi awal gambar:", err);
    }

    // 2. Coba Firebase Storage jika aktif (dengan batas waktu 3.5 detik agar tidak menggantung jika Storage belum aktif/Blaze)
    if (isFirebaseActive && firebaseStorage) {
      try {
        const { ref, uploadBytes, getDownloadURL } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js');
        const storageRef = ref(firebaseStorage, `${path}/${Date.now()}_${file.name}`);
        
        const uploadTask = uploadBytes(storageRef, file);
        const timeoutTask = new Promise((_, reject) => setTimeout(() => reject(new Error('Storage timeout')), 3500));
        
        const snap = await Promise.race([uploadTask, timeoutTask]);
        const url = await getDownloadURL(snap.ref);
        return { url, path: snap.ref.fullPath };
      } catch (err) {
        console.warn('[DataService] Firebase storage tidak aktif / dibatasi paket Spark, otomatis beralih ke data terkompresi:', err.message);
      }
    }

    // 3. Fallback instan: gunakan Data URL terkompresi (~50KB) yang 100% aman disimpan ke Firestore & LocalStore
    if (compressedDataUrl) {
      return { url: compressedDataUrl, path: 'local/' + file.name };
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({ url: e.target.result, path: 'local/' + file.name });
      };
      reader.readAsDataURL(file);
    });
  },

  // Sinkronisasi data awal ke Cloud Firestore secara massal
  async syncSeedDataToFirestore() {
    await ensureFirebaseInitialized();
    if (!firestoreDb) {
      throw new Error("Firebase Firestore belum terhubung. Silakan masukkan kredensial Firebase terlebih dahulu.");
    }

    const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

    // 1. Settings
    await setDoc(doc(firestoreDb, 'settings', 'general'), INITIAL_SETTINGS.general);
    await setDoc(doc(firestoreDb, 'settings', 'home'), INITIAL_SETTINGS.home);
    await setDoc(doc(firestoreDb, 'settings', 'about'), INITIAL_SETTINGS.about);
    await setDoc(doc(firestoreDb, 'settings', 'banners'), INITIAL_SETTINGS.banners);

    // 2. Categories
    for (const cat of INITIAL_CATEGORIES) {
      await setDoc(doc(firestoreDb, 'categories', cat.id), cat);
    }

    // 3. Products
    for (const prod of INITIAL_PRODUCTS) {
      await setDoc(doc(firestoreDb, 'products', prod.id), prod);
    }

    // 4. Gallery
    for (const g of INITIAL_GALLERY) {
      await setDoc(doc(firestoreDb, 'gallery', g.id), g);
    }

    // 5. Testimonials
    for (const t of INITIAL_TESTIMONIALS) {
      await setDoc(doc(firestoreDb, 'testimonials', t.id), t);
    }

    // 6. FAQs
    for (const f of INITIAL_FAQS) {
      await setDoc(doc(firestoreDb, 'faqs', f.id), f);
    }

    // 7. Posts
    for (const p of INITIAL_POSTS) {
      await setDoc(doc(firestoreDb, 'posts', p.id), p);
    }

    return true;
  }
};

// =========================================================================
// AUTHENTICATION SERVICE (Admin login/logout/session)
// =========================================================================

export const AuthService = {
  async login(email, password) {
    await ensureFirebaseInitialized();

    // 1. Firebase Auth jika aktif
    if (isFirebaseActive && firebaseAuth) {
      try {
        const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
        const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const sessionUser = { email: cred.user.email, uid: cred.user.uid, displayName: cred.user.displayName || "Admin Firebase" };
        localStorage.setItem('kenes_admin_session', JSON.stringify(sessionUser));
        return { success: true, user: sessionUser };
      } catch (err) {
        // Cek fallback ke akun demo jika akun Firebase belum didaftarkan
        const storedAdmin = getLocalStore('admin_user') || {
          email: "admin@kenessouvenir.com",
          password: "admin123",
          displayName: "Administrator"
        };
        if (email === storedAdmin.email && password === storedAdmin.password) {
          const sessionUser = { email: storedAdmin.email, displayName: storedAdmin.displayName, uid: "admin_local_123" };
          localStorage.setItem('kenes_admin_session', JSON.stringify(sessionUser));
          return { success: true, user: sessionUser };
        }
        return { success: false, error: "Gagal login: " + err.message };
      }
    }

    // 2. Local Fallback Auth untuk demo admin
    const storedAdmin = getLocalStore('admin_user') || {
      email: "admin@kenessouvenir.com",
      password: "admin123",
      displayName: "Administrator"
    };

    if (email === storedAdmin.email && password === storedAdmin.password) {
      const sessionUser = { email: storedAdmin.email, displayName: storedAdmin.displayName, uid: "admin_local_123" };
      localStorage.setItem('kenes_admin_session', JSON.stringify(sessionUser));
      return { success: true, user: sessionUser };
    }

    return { success: false, error: "Email atau password admin tidak cocok. (Default demo: admin@kenessouvenir.com / admin123)" };
  },

  logout() {
    if (isFirebaseActive && firebaseAuth) {
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js').then(({ signOut }) => {
        signOut(firebaseAuth);
      });
    }
    localStorage.removeItem('kenes_admin_session');
    window.location.href = 'login.html';
  },

  getCurrentUser() {
    const session = localStorage.getItem('kenes_admin_session');
    return session ? JSON.parse(session) : null;
  },

  async resetPassword(email) {
    await ensureFirebaseInitialized();

    if (isFirebaseActive && firebaseAuth) {
      try {
        const { sendPasswordResetEmail } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
        await sendPasswordResetEmail(firebaseAuth, email);
        return { success: true, message: "Email pemulihan kata sandi telah dikirimkan via Firebase." };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }
    return { success: true, message: `Instruksi reset kata sandi telah disimulasikan untuk ${email}.` };
  }
};
