<pre align="center">
   ░███   ░██████                             ░██ 
  ░██░██    ░██                               ░██ 
 ░██  ░██   ░██  ░███████  ░███████  ░██████  ░██ 
░█████████  ░██ ░██       ░██    ░██      ░██ ░██ 
░██    ░██  ░██  ░███████ ░██    ░██ ░███████ ░██ 
░██    ░██  ░██        ░██░██    ░██░██   ░██ ░██ 
░██    ░██░██████░███████  ░███████  ░█████░██░██ 
</pre>

# Frontend Layer

> _Sudah berhasil buat jalanin Backend Layer? Jika belum [📄 Lihat Panduan](https://github.com/aisoal/backend) terlebih dahulu._

Modul ini adalah **Frontend Layer** berbasis React (Vite) yang berfungsi sebagai antarmuka utama pengguna dalam ekosistem AIsoal. Dirancang dengan **Chakra UI** untuk pengalaman pengguna yang responsif dan intuitif, modul ini memungkinkan pendidik untuk berinteraksi langsung dengan mesin AI.

Frontend ini menangani:

1.  **Generation Interface**: Dashboard unggah PDF dengan konfigurasi parameter (Model, Tipe Soal, Tingkat Kesulitan Bloom).
2.  **Session & History**: Manajemen riwayat pembuatan soal lengkap dengan fitur edit judul dan hapus sesi.
3.  **Advanced Exporting**: Mesin ekspor canggih yang mendukung format DOCX, PDF, CSV, XLSX, JSON, hingga ZIP (batch export).

---

## 🚀 Persiapan & Instalasi

Frontend ini memerlukan **Backend (Node.js)** berjalan agar dapat melakukan autentikasi dan generasi soal.

### Instalasi Dependensi

Pastikan Node.js (v18+) telah terinstall.

```bash
# Install package
yarn install

# Menjalankan dalam mode development
yarn dev
```

_Secara default, aplikasi akan berjalan di `http://localhost:9999`._

---

## 🛠️ Fitur Unggulan

- **Mode Structured**: Mengunci distribusi tingkat kesulitan pada rasio 40:30:30 (LOTS:MOTS:HOTS) secara otomatis sesuai metodologi penelitian.
- **Deep Integration Monitoring**: Menampilkan data pada setiap batch soal yang dihasilkan.
- **Interactive Preview**: Kartu soal yang mendukung fitur salin cepat, umpan balik (like/dislike), dan seleksi item untuk diekspor.
- **Model Benchmarking Tools**: Halaman statistik khusus performa antar model (GPT, Claude, Gemini, Grok, Sonar) secara visual.

---

## 📦 Teknologi Utama

- **Core**: React 18 & Vite (Fast Build Tool).
- **UI Framework**: Chakra UI (Atomic Design Systems).
- **Routing**: React Router Dom v6 (Dynamic Routing).
- **State Management**: Context API (Auth & User Session).
- **Charts**: React-Chartjs-2 & Chart.js (Data Visualization).
- **File Processing**: `docx`, `jspdf`, `xlsx`, `jszip` (Export Engine).

---

## 📂 Struktur Folder Utama

```text
frontend/
├── src/
│   ├── api/              # Konfigurasi Axios & Base URL
│   ├── components/       # Komponen UI Reusable (ProtectedRoute, Seo, dll)
│   ├── context/          # AuthContext untuk manajemen sesi user
│   ├── helpers/          # exportFiles.js (Logika konversi dokumen)
│   ├── pages/            # Page-based Routing
│   │   ├── history/      # Halaman manajemen riwayat & analisis
│   │   ├── stats/        # Halaman statistik performa model global
│   │   ├── [id].js       # Detail sesi generasi (Dynamic Route)
│   │   └── index.js      # Halaman utama (Upload & Configure)
│   └── options.js        # Konfigurasi opsi (Bloom's Taxonomy, Bahasa)
├── vite.config.js        # Konfigurasi Vite & Auto-Import
└── package.json          # Manifest dependensi
```

## Selesai
