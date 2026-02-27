import { BlacklistEntry, CitizenEntry, AuditLogEntry } from '@/types/kyc';

const FIRST_NAMES = ['Ahmad', 'Budi', 'Citra', 'Dewi', 'Eka', 'Farhan', 'Gita', 'Hendra', 'Indah', 'Joko', 'Kartika', 'Lukman', 'Maya', 'Nadia', 'Oscar', 'Putri', 'Raka', 'Sari', 'Taufik', 'Umar'];
const LAST_NAMES = ['Pratama', 'Suharto', 'Wijaya', 'Kusuma', 'Santoso', 'Hidayat', 'Nugroho', 'Saputra', 'Setiawan', 'Rahayu', 'Permana', 'Gunawan', 'Susanto', 'Purnomo', 'Wibowo'];
const KECAMATAN = ['Menteng', 'Kebayoran Baru', 'Tanah Abang', 'Gambir', 'Setiabudi', 'Cempaka Putih', 'Kemayoran', 'Sawah Besar', 'Johar Baru', 'Senen'];
const KOTA = ['Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Barat', 'Jakarta Utara', 'Jakarta Timur', 'Bandung', 'Surabaya', 'Yogyakarta', 'Semarang', 'Medan'];
const PROVINSI = ['DKI Jakarta', 'Jawa Barat', 'Jawa Timur', 'DI Yogyakarta', 'Jawa Tengah', 'Sumatera Utara', 'Bali', 'Sulawesi Selatan'];
const ALAMAT = ['Jl. Sudirman No.', 'Jl. Thamrin No.', 'Jl. Gatot Subroto No.', 'Jl. Merdeka No.', 'Jl. Diponegoro No.', 'Jl. Ahmad Yani No.'];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateNIK(): string {
  const digits = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10));
  return digits.join('');
}

function generateDate(startYear: number, endYear: number): string {
  const year = startYear + Math.floor(Math.random() * (endYear - startYear));
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateCitizens(count: number): CitizenEntry[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    nik: generateNIK(),
    nama: `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`,
    tanggal_lahir: generateDate(1960, 2005),
    jenis_kelamin: Math.random() > 0.5 ? 'L' as const : 'P' as const,
    alamat: `${randomFrom(ALAMAT)} ${Math.floor(Math.random() * 200) + 1}`,
    kecamatan: randomFrom(KECAMATAN),
    kota: randomFrom(KOTA),
    provinsi: randomFrom(PROVINSI),
  }));
}

export const initialBlacklist: BlacklistEntry[] = [
  { id: 1, nik: '3201010101010001', nama: 'Suspect Alpha', alasan_blacklist: 'Fraud', tanggal_ditambahkan: '2024-01-15' },
  { id: 2, nik: '3201010101010002', nama: 'Suspect Beta', alasan_blacklist: 'PEP', tanggal_ditambahkan: '2024-03-22' },
  { id: 3, nik: '3201010101010003', nama: 'Suspect Gamma', alasan_blacklist: 'Kriminal', tanggal_ditambahkan: '2024-06-10' },
];

export const initialCitizens: CitizenEntry[] = generateCitizens(15);

export function createAuditLog(admin: string, action: string, data: string): AuditLogEntry {
  return {
    id: Date.now(),
    admin_name: admin,
    action,
    data_accessed: data,
    timestamp: new Date().toISOString(),
  };
}
