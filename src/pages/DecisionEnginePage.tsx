import { useState } from "react";
import { VerificationResult } from "@/types/kyc";
import { initialBlacklist, initialCitizens, createAuditLog } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, XCircle, Shield, Camera, Lock, HardDrive, Search } from "lucide-react";
import { useAuditStore } from "@/stores/audit-store";

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score > 85 ? 'bg-success' : score > 60 ? 'bg-warning' : 'bg-danger';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium">{score}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default function DecisionEnginePage() {
  const [nik, setNik] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const addLog = useAuditStore((s) => s.addLog);

  const runVerification = () => {
    setError(null);
    setResult(null);

    if (!nik || nik.length < 10) {
      setError("Masukkan NIK yang valid (minimal 10 digit)");
      return;
    }

    // Check blacklist
    const blacklisted = initialBlacklist.some((b) => b.nik === nik);
    if (blacklisted) {
      const entry = initialBlacklist.find((b) => b.nik === nik)!;
      setResult({
        nik,
        nama: entry.nama,
        identity_score: 20,
        security_score: 10,
        cdd_score: 15,
        final_score: 15,
        risk_level: 'REJECTED',
        message: 'Maaf, Verifikasi Gagal (Indikasi Fraud)',
        blacklisted: true,
        found_in_dukcapil: true,
      });
      addLog(createAuditLog('Admin', 'Verification - REJECTED (Blacklisted)', `NIK: ${nik}`));
      return;
    }

    // Check Dukcapil
    const citizen = initialCitizens.find((c) => c.nik === nik);
    if (!citizen) {
      setError("Error: NIK tidak terdaftar di Dukcapil");
      addLog(createAuditLog('Admin', 'Verification - NIK Not Found', `NIK: ${nik}`));
      return;
    }

    // Simulate scores
    const identity_score = 70 + Math.floor(Math.random() * 30);
    const security_score = 60 + Math.floor(Math.random() * 40);
    const cdd_score = 55 + Math.floor(Math.random() * 45);
    const final_score = Math.round((identity_score + security_score + cdd_score) / 3);

    let risk_level: VerificationResult['risk_level'];
    let message: string;

    if (final_score > 85) {
      risk_level = 'AUTO_APPROVED';
      message = 'Selamat! Akun Anda Aktif';
    } else if (final_score >= 60) {
      risk_level = 'MANUAL_REVIEW';
      message = 'Permintaan Anda Sedang Ditinjau';
    } else {
      risk_level = 'REJECTED';
      message = 'Maaf, Verifikasi Gagal (Indikasi Fraud)';
    }

    setResult({
      nik, nama: citizen.nama,
      identity_score, security_score, cdd_score, final_score,
      risk_level, message,
      blacklisted: false, found_in_dukcapil: true,
    });
    addLog(createAuditLog('Admin', `Verification - ${risk_level}`, `NIK: ${nik}, Score: ${final_score}`));
  };

  const ResultCard = ({ result }: { result: VerificationResult }) => {
    const config = {
      AUTO_APPROVED: {
        cardClass: 'risk-card-success animate-pulse-success',
        icon: <CheckCircle2 className="h-8 w-8 text-success" />,
        badgeClass: 'bg-success text-success-foreground',
        storageLabel: 'Simpan Foto Terenkripsi (Compliance)',
      },
      MANUAL_REVIEW: {
        cardClass: 'risk-card-warning animate-pulse-warning',
        icon: <AlertTriangle className="h-8 w-8 text-warning" />,
        badgeClass: 'bg-warning text-warning-foreground',
        storageLabel: 'Simpan Foto & Tandai Review',
      },
      REJECTED: {
        cardClass: 'risk-card-danger animate-pulse-danger',
        icon: <XCircle className="h-8 w-8 text-danger" />,
        badgeClass: 'bg-danger text-danger-foreground',
        storageLabel: null,
      },
    }[result.risk_level];

    return (
      <Card className={`${config.cardClass} transition-all`}>
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          {config.icon}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{result.nama}</CardTitle>
              <Badge className={config.badgeClass}>{result.risk_level}</Badge>
            </div>
            <p className="text-sm text-muted-foreground font-mono">NIK: {result.nik}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold font-mono">{result.final_score}</div>
            <div className="text-xs text-muted-foreground">Final Trust Score</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm font-medium">{result.message}</p>
          
          {result.blacklisted && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-danger/10 border border-danger/20">
              <Shield className="h-4 w-4 text-danger" />
              <span className="text-sm font-medium text-danger">Peringatan: NIK terdaftar di Blacklist</span>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <ScoreBar label="Identity Score" score={result.identity_score} />
            <ScoreBar label="Security Score" score={result.security_score} />
            <ScoreBar label="CDD Score" score={result.cdd_score} />
          </div>

          {config.storageLabel && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-muted border">
              <Camera className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{config.storageLabel}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          KYC Decision Engine
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Verification Simulator & Trust Score Calculator</p>
      </div>

      {/* Input Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="flex-1">
              <Label>NIK (Nomor Induk Kependudukan)</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter 16-digit NIK to verify..."
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  className="pl-9 font-mono"
                  maxLength={16}
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button onClick={runVerification} size="lg">Run Verification</Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Tip: Use a NIK from the Dukcapil database or a Blacklist NIK to test different scenarios
          </p>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-lg risk-card-danger">
          <XCircle className="h-5 w-5 text-danger shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Result */}
      {result && <ResultCard result={result} />}

      {/* Object Storage Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <HardDrive className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Object Storage (OSS) — KTP</p>
              <p className="text-xs text-muted-foreground">Encrypted at rest • AES-256</p>
            </div>
            <Badge variant="outline" className="bg-success/10 text-success border-success/30 gap-1">
              <Lock className="h-3 w-3" /> Encrypted
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Camera className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Object Storage (OSS) — Selfie</p>
              <p className="text-xs text-muted-foreground">Encrypted at rest • AES-256</p>
            </div>
            <Badge variant="outline" className="bg-success/10 text-success border-success/30 gap-1">
              <Lock className="h-3 w-3" /> Encrypted
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
