export interface BlacklistEntry {
  id: number;
  nik: string;
  nama: string;
  alasan_blacklist: 'PEP' | 'Kriminal' | 'Fraud';
  tanggal_ditambahkan: string;
}

export interface CitizenEntry {
  id: number;
  nik: string;
  nama: string;
  tanggal_lahir: string;
  jenis_kelamin: 'L' | 'P';
  alamat: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
}

export interface AuditLogEntry {
  id: number;
  admin_name: string;
  action: string;
  data_accessed: string;
  timestamp: string;
}

export type RiskLevel = 'AUTO_APPROVED' | 'MANUAL_REVIEW' | 'REJECTED';

export interface VerificationResult {
  nik: string;
  nama: string;
  identity_score: number;
  security_score: number;
  cdd_score: number;
  final_score: number;
  risk_level: RiskLevel;
  message: string;
  blacklisted: boolean;
  found_in_dukcapil: boolean;
}
