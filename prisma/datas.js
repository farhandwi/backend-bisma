const categories = [
  {
    id: 1,
    kategori: "Tutor Sebaya",
  },
  {
    id: 2,
    kategori: "Asisten Praktikum",
  },
  {
    id: 3,
    kategori: "Asisten Pengembangan Materi Dan Video Tutorial",
  },
  {
    id: 4,
    kategori: "Asisten Pengembangan Aplikasi",
  },
  {
    id: 5,
    kategori: "Asisten Dalam Kegiatan Pengabdian Masyarakat",
  },
  {
    id: 6,
    kategori: "Asisten Penelitian",
  },
  {
    id: 7,
    kategori: "Pembuatan Design Media Visual",
  },
  {
    id: 8,
    kategori: "Pembuatan Design Media Audio Visual",
  },
  {
    id: 9,
    kategori: "Asisten Pustakawan",
  },
  {
    id: 10,
    kategori: "Asisten Akademik",
  },
  {
    id: 11,
    kategori: "Asisten Digitalisasi Dan Pengolahan Data",
  },
  {
    id: 12,
    kategori: "Petugas Pelaksana",
  },
  {
    id: 13,
    kategori: "Pekerjaan Administratif, Pengolahan Data Dan Pusat Infromasi, dan Pekerjaan Lain",
  },
];

const master_users = [
  {
    username: "l.putri03",
    password: "rahasia",
    name: "LEONITA MAHARANI PUTRI",
  },
  {
    username: "f.sejani",
    password: "rahasia",
    name: "FEBRIANA RESKA SEJANI",
  },
  {
    username: "n.caesarina",
    password: "rahasia",
    name: "NAILA PUTRI CAESARINA",
  },
  {
    username: "meredita",
    password: "rahasia",
    name: "Ibu Meredita Susanty",
  },
  {
    username: "arahman",
    password: "rahasia",
    name: "Dr. Eng. Ari Rahman, S.T., M.Eng",
  },
  {
    username: "l.luluk",
    password: "rahasia",
    name: "MBAK LULUK",
  },
];

const users = [
  {
    id: "104219006",
    nama: "LEONITA MAHARANI PUTRI",
    username: "l.putri03",
    departemen: "Teknik Lingkungan",
    no_telp: "085990100010",
    no_rekening: "10000001",
    status: "MAHASISWA",
  },
  {
    id: "104219025",
    nama: "FEBRIANA RESKA SEJANI",
    username: "f.sejani",
    departemen: "Teknik Lingkungan",
    no_telp: "085990100011",
    no_rekening: "10000002",
    status: "MAHASISWA",
  },
  {
    id: "1042200004",
    nama: "NAILA PUTRI CAESARINA",
    username: "n.caesarina",
    departemen: "Teknik Lingkungan",
    no_telp: "085990100012",
    no_rekening: "10000003",
    status: "MAHASISWA",
  },
  {
    id: "116043",
    nama: "Dr. Eng. Ari Rahman, S.T., M.Eng",
    username: "arahman",
    departemen: "Teknik Lingkungan",
    no_telp: "085990100013",
    no_rekening: "10000004",
    status: "STAF",
  },
  {
    id: "116042",
    nama: "Ibu Meredita Susanty",
    username: "meredita",
    departemen: "Ilmu Komputer",
    no_telp: "085990100014",
    no_rekening: "10000005",
    status: "STAF",
  },
  {
    id: "112341",
    nama: "MBAK LULUK",
    username: "l.luluk",
    departemen: "SIP",
    no_telp: "085990100014",
    no_rekening: "10000005",
    status: "MANAGER",
  },
];

const incentives_unit = [
  {
    id: 1,
    satuan: "menit",
  },
  {
    id: 2,
    satuan: "Karya/Hasil Pekerjaan",
  },
];

const activities = [
  {
    id: 1,
    kegiatan: "Pelaksanaan",
  },
  {
    id: 2,
    kegiatan: "Persiapan",
  },
  {
    id: 3,
    kegiatan: "Penutupan",
  },
];

const positions = [
  {
    id: 1,
    posisi: "Ketua Program Studi",
  },
  {
    id: 2,
    posisi: "Dosen",
  },
  {
    id: 3,
    posisi: "Kepala Keuangan",
  },
  {
    id: 4,
    posisi: "Mahasiswa",
  },
];

const master_projects = [
  {
    id: 1,
    id_kategori: 2,
    nama: "Asisten Praktikum Kualitas Lingkungan",
    pic: "116043",
    inisial_project: "APKL",
    tanggal_mulai: "2023-07-01T00:00:00.000Z",
    tanggal_selesai: "2023-10-01T00:00:00.000Z",
  },
  {
    id: 2,
    id_kategori: 2,
    nama: "Asisten Praktikum Dasar Pemrograman",
    pic: "116042",
    inisial_project: "APDP",
    tanggal_mulai: "2023-05-01T00:00:00.000Z",
    tanggal_selesai: "2023-10-01T00:00:00.000Z",
  },
  {
    id: 3,
    id_kategori: 2,
    nama: "Asisten Praktikum Algoritma dan Struktur Data",
    pic: "116042",
    inisial_project: "APSD",
    tanggal_mulai: "2023-05-01T00:00:00.000Z",
    tanggal_selesai: "2023-10-01T00:00:00.000Z",
  },
];

const projects = [
  {
    id: 1,
    id_project: 1,
    id_peserta: "104219006",
    estimasi: 400000,
    durasi: 13,
  },
  {
    id: 2,
    id_project: 2,
    id_peserta: "104219025",
    estimasi: 750000,
    durasi: 25,
  },
  {
    id: 3,
    id_project: 3,
    id_peserta: "1042200004",
    estimasi: 1200000,
    durasi: 40,
  },
  {
    id: 4,
    id_project: 3,
    id_peserta: "104219025",
    estimasi: 650000,
    durasi: 22,
  },
  {
    id: 5,
    id_project: 3,
    id_peserta: "1042200004",
    estimasi: 650000,
    durasi: 22,
  },
];

const timesheets = [
  {
    id: 1,
    id_kategori_kegiatan: 2,
    id_tran_project: 1,
    tanggal: "2023-07-01T00:00:00.000Z",
    jam_mulai: "2021-01-01T16:50:00.000Z",
    jam_selesai: "2021-01-01T23:00:00.000Z",
    deskripsi: "Bercocok Tanam",
    total_sesi: 5,
  },
  {
    id: 2,
    id_kategori_kegiatan: 1,
    id_tran_project: 2,
    tanggal: "2023-07-22T00:00:00.000Z",
    jam_mulai: "2021-01-01T10:50:00.000Z",
    jam_selesai: "2021-01-01T20:00:00.000Z",
    deskripsi: "Pengenalan Variable",
    total_sesi: 10,
  },
  {
    id: 3,
    id_kategori_kegiatan: 1,
    id_tran_project: 3,
    tanggal: "2023-08-01T00:00:00.000Z",
    jam_mulai: "2021-01-01T06:50:00.000Z",
    jam_selesai: "2021-01-01T12:00:00.000Z",
    deskripsi: "Review Materi Dasar Pemrograman",
    total_sesi: 5,
  },
  {
    id: 4,
    id_kategori_kegiatan: 2,
    id_tran_project: 2,
    tanggal: "2023-09-11T00:00:00.000Z",
    jam_mulai: "2021-01-01T10:00:00.000Z",
    jam_selesai: "2021-01-01T16:00:00.000Z",
    deskripsi: "Pengenalan If Else",
    total_sesi: 6,
  },
  {
    id: 5,
    id_kategori_kegiatan: 3,
    id_tran_project: 3,
    tanggal: "2023-10-12T00:00:00.000Z",
    jam_mulai: "2021-01-01T10:00:00.000Z",
    jam_selesai: "2021-01-01T16:00:00.000Z",
    deskripsi: "Pengenalan Struct",
    total_sesi: 6,
  },
  {
    id: 6,
    id_kategori_kegiatan: 2,
    id_tran_project: 3,
    tanggal: "2023-08-20T00:00:00.000Z",
    jam_mulai: "1970-01-01T13:56:27.000Z",
    jam_selesai: "1970-01-01T23:56:27.000Z",
    deskripsi: "Berjalan-jalan",
    total_sesi: 10,
  },
  {
    id: 7,
    id_kategori_kegiatan: 2,
    id_tran_project: 4,
    tanggal: "2023-08-20T00:00:00.000Z",
    jam_mulai: "1970-01-01T13:56:27.000Z",
    jam_selesai: "1970-01-01T23:56:27.000Z",
    deskripsi: "Berjalan-jalan",
    total_sesi: 10,
  },
];

const incentives = [
  {
    id: 1,
    id_kategori: 1,
    id_satuan: 1,
    besaran_insentif: 30000,
    durasi_satuan: 50,
  },
  {
    id: 2,
    id_kategori: 2,
    id_satuan: 1,
    besaran_insentif: 40000,
    durasi_satuan: 50,
  },
  {
    id: 3,
    id_kategori: 3,
    id_satuan: 1,
    besaran_insentif: 30000,
    durasi_satuan: 50,
  },
  {
    id: 4,
    id_kategori: 4,
    id_satuan: 1,
    besaran_insentif: 40000,
    durasi_satuan: 50,
  },
  {
    id: 5,
    id_kategori: 5,
    id_satuan: 1,
    besaran_insentif: 40000,
    durasi_satuan: 50,
  },
  {
    id: 6,
    id_kategori: 6,
    id_satuan: 1,
    besaran_insentif: 40000,
    durasi_satuan: 50,
  },
  {
    id: 7,
    id_kategori: 7,
    id_satuan: 2,
    besaran_insentif: 100000,
    durasi_satuan: null,
  },
  {
    id: 8,
    id_kategori: 8,
    id_satuan: 2,
    besaran_insentif: 750000,
    durasi_satuan: null,
  },
  {
    id: 9,
    id_kategori: 9,
    id_satuan: 1,
    besaran_insentif: 40000,
    durasi_satuan: 50,
  },
  {
    id: 10,
    id_kategori: 10,
    id_satuan: 1,
    besaran_insentif: 40000,
    durasi_satuan: 50,
  },
];

const user_positions = [
  {
    id: 1,
    id_pengguna: "104219006",
    id_posisi: 4,
  },
  {
    id: 2,
    id_pengguna: "116043",
    id_posisi: 2,
  },
  {
    id: 3,
    id_pengguna: "104219025",
    id_posisi: 4,
  },
  {
    id: 4,
    id_pengguna: "1042200004",
    id_posisi: 4,
  },
  {
    id: 5,
    id_pengguna: "116042",
    id_posisi: 2,
  },
  {
    id: 6,
    id_pengguna: "112341",
    id_posisi: 3,
  },
];

const payments_status = [
  {
    id: 1,
    status: "Submitted",
  },
  {
    id: 2,
    status: "Waiting Payment",
  },
  {
    id: 3,
    status: "Paid",
  },
];

const timesheets_status = [
  {
    id: 1,
    status: "Approved",
  },
  {
    id: 2,
    status: "Rejected",
  },
  {
    id: 3,
    status: "Revision Required",
  },
  {
    id: 4,
    status: "Waiting For Approval",
  },
  {
    id: 5,
    status: "In Process",
  },
  {
    id: 6,
    status: "Paid",
  },
];

const payments = [
  {
    id: 1,
    id_tran_project: 1,
    periode: 8,
    total_tagihan: 3200000,
    url_file_sp3: "https://drive.com",
    id_status: 1,
  },
  {
    id: 2,
    id_tran_project: 2,
    periode: 8,
    total_tagihan: 4200000,
    url_file_sp3: "https://facebook.com",
    id_status: 2,
  },
  {
    id: 3,
    id_tran_project: 3,
    periode: 8,
    total_tagihan: 5200000,
    url_file_sp3: "https://instagram.com",
    id_status: 3,
  },
  {
    id: 4,
    id_tran_project: 4,
    periode: 8,
    total_tagihan: 3200000,
    url_file_sp3: "https://instagram.com",
    id_status: 3,
  },
  {
    id: 5,
    id_tran_project: 5,
    periode: 8,
    total_tagihan: 650000,
    url_file_sp3: "https://linkedin.com",
    id_status: 3,
  },
];

export { users, user_positions, timesheets, timesheets_status, payments, payments_status, incentives, incentives_unit, positions, master_users, master_projects, projects, activities, categories };
