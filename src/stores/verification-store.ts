import { create } from 'zustand';
import { VerificationResult } from '@/types/kyc';

interface VerificationStore {
  results: VerificationResult[];
  addResult: (result: VerificationResult) => void;
}

export const useVerificationStore = create<VerificationStore>((set) => ({
  results: [],
  addResult: (result) => set((state) => ({ results: [result, ...state.results] })),
}));
