import { create } from 'zustand';
import { AuditLogEntry } from '@/types/kyc';

interface AuditStore {
  logs: AuditLogEntry[];
  addLog: (log: AuditLogEntry) => void;
}

export const useAuditStore = create<AuditStore>((set) => ({
  logs: [],
  addLog: (log) => set((state) => ({ logs: [log, ...state.logs] })),
}));
