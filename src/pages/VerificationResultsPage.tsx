import { useState } from "react";
import { useAuditStore } from "@/stores/audit-store";
import { useVerificationStore } from "@/stores/verification-store";
import { VerificationResult, RiskLevel } from "@/types/kyc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ClipboardList, Search, TrendingUp, TrendingDown, Minus, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

function getGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 85) return "A";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "C+";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

function getPredikat(score: number): string {
  if (score >= 85) return "Sangat Baik";
  if (score >= 70) return "Baik";
  if (score >= 60) return "Cukup";
  if (score >= 40) return "Kurang";
  return "Sangat Kurang";
}

const riskConfig: Record<RiskLevel, { icon: React.ReactNode; badgeClass: string; label: string }> = {
  AUTO_APPROVED: {
    icon: <CheckCircle2 className="h-4 w-4 text-success" />,
    badgeClass: "bg-success/15 text-success border-success/30",
    label: "Auto Approved",
  },
  MANUAL_REVIEW: {
    icon: <AlertTriangle className="h-4 w-4 text-warning" />,
    badgeClass: "bg-warning/15 text-warning border-warning/30",
    label: "Manual Review",
  },
  REJECTED: {
    icon: <XCircle className="h-4 w-4 text-danger" />,
    badgeClass: "bg-danger/15 text-danger border-danger/30",
    label: "Rejected",
  },
};

function ScoreTrend({ score }: { score: number }) {
  if (score >= 85) return <TrendingUp className="h-4 w-4 text-success" />;
  if (score >= 60) return <Minus className="h-4 w-4 text-warning" />;
  return <TrendingDown className="h-4 w-4 text-danger" />;
}

export default function VerificationResultsPage() {
  const results = useVerificationStore((s) => s.results);
  const [search, setSearch] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("all");

  const filtered = results.filter((r) => {
    const matchSearch =
      r.nik.includes(search) || r.nama.toLowerCase().includes(search.toLowerCase());
    const matchRisk = filterRisk === "all" || r.risk_level === filterRisk;
    return matchSearch && matchRisk;
  });

  const stats = {
    total: results.length,
    approved: results.filter((r) => r.risk_level === "AUTO_APPROVED").length,
    review: results.filter((r) => r.risk_level === "MANUAL_REVIEW").length,
    rejected: results.filter((r) => r.risk_level === "REJECTED").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" />
          Verification Results
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Riwayat hasil verifikasi KYC — Score, Grade, dan Predikat
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold font-mono">{stats.total}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Verifikasi</p>
          </CardContent>
        </Card>
        <Card className="border-success/30">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold font-mono text-success">{stats.approved}</p>
            <p className="text-xs text-muted-foreground mt-1">Approved</p>
          </CardContent>
        </Card>
        <Card className="border-warning/30">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold font-mono text-warning">{stats.review}</p>
            <p className="text-xs text-muted-foreground mt-1">Manual Review</p>
          </CardContent>
        </Card>
        <Card className="border-danger/30">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold font-mono text-danger">{stats.rejected}</p>
            <p className="text-xs text-muted-foreground mt-1">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari NIK atau Nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterRisk} onValueChange={setFilterRisk}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="AUTO_APPROVED">Auto Approved</SelectItem>
            <SelectItem value="MANUAL_REVIEW">Manual Review</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NIK</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead className="text-center">Identity</TableHead>
                <TableHead className="text-center">Security</TableHead>
                <TableHead className="text-center">CDD</TableHead>
                <TableHead className="text-center">Final Score</TableHead>
                <TableHead className="text-center">Grade</TableHead>
                <TableHead>Predikat</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">
                    {results.length === 0
                      ? "Belum ada hasil verifikasi. Jalankan verifikasi di Decision Engine."
                      : "Tidak ada hasil yang cocok dengan filter."}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((r, i) => {
                  const grade = getGrade(r.final_score);
                  const predikat = getPredikat(r.final_score);
                  const cfg = riskConfig[r.risk_level];
                  return (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-sm">{r.nik}</TableCell>
                      <TableCell className="font-medium">{r.nama}</TableCell>
                      <TableCell className="text-center font-mono">{r.identity_score}</TableCell>
                      <TableCell className="text-center font-mono">{r.security_score}</TableCell>
                      <TableCell className="text-center font-mono">{r.cdd_score}</TableCell>
                      <TableCell className="text-center">
                        <span className="font-mono font-bold text-lg">{r.final_score}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono font-bold">
                          {grade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{predikat}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${cfg.badgeClass} gap-1`}>
                          {cfg.icon}
                          {cfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <ScoreTrend score={r.final_score} />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
