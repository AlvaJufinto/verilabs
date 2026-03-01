/** @format */

import { useState } from "react";

import {
	AlertTriangle,
	Camera,
	CheckCircle2,
	Search,
	Shield,
	XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuditStore } from "@/stores/audit-store";
import { useVerificationStore } from "@/stores/verification-store";
import { VerificationResult } from "@/types/kyc";

function ScoreBar({ label, score }: { label: string; score: number }) {
	const color =
		score > 85 ? "bg-success" : score > 60 ? "bg-warning" : "bg-danger";
	return (
		<div className="space-y-1">
			<div className="flex justify-between text-sm">
				<span className="text-muted-foreground">{label}</span>
				<span className="font-mono font-medium">{score}</span>
			</div>
			<div className="h-2 bg-muted rounded-full overflow-hidden">
				<div
					className={`h-full rounded-full transition-all duration-700 ${color}`}
					style={{ width: `${score}%` }}
				/>
			</div>
		</div>
	);
}

export default function DecisionEnginePage() {
	const [nik, setNik] = useState("");
	const [result, setResult] = useState<any | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const addLog = useAuditStore((s) => s.addLog);
	const addResult = useVerificationStore((s) => s.addResult);

	const API_URL = import.meta.env.VITE_API_URL || process.env.API_URL;

	const runVerification = async () => {
		setError(null);
		setResult(null);
		if (!nik || nik.length < 10) {
			setError("Masukkan NIK yang valid (minimal 10 digit)");
			return;
		}
		setLoading(true);
		try {
			const res = await fetch(`${API_URL}/v1/kyc/verify-nik`, {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({ nik }),
			});
			const data = await res.json();
			console.log("🚀 ~ runVerification ~ data:", data);
			if (!res.ok) {
				setError(data.error || "Verifikasi gagal");
				return;
			}
			// Map API response to local result structure
			const final_score = data.final_trust_score;
			let risk_level: VerificationResult["risk_level"];
			let message: string;
			if (data.decision === "Auto-Approved") {
				risk_level = "AUTO_APPROVED";
				message = "Selamat! Akun Anda Aktif";
			} else if (data.decision === "Manual Review") {
				risk_level = "MANUAL_REVIEW";
				message = "Permintaan Anda Sedang Ditinjau";
			} else {
				risk_level = "REJECTED";
				message = "Maaf, Verifikasi Gagal (Indikasi Fraud)";
			}
			const resObj: VerificationResult = {
				nik: data.nik,
				nama: data.nama,
				identity_score: data.identityScore ?? 0,
				security_score: data.livenessScore ?? 0,
				cdd_score: (data.riskScore ?? 0) + (data.complianceScore ?? 0),
				final_score,
				risk_level,
				message,
				blacklisted: false,
				found_in_dukcapil: true,
			};
			setResult({ ...resObj, reason: data.reason });
			addResult(resObj);
		} catch (e: any) {
			setError(e.message || "Verifikasi gagal");
		} finally {
			setLoading(false);
		}
	};

	const ResultCard = ({ result }: { result: any }) => {
		const config = {
			AUTO_APPROVED: {
				cardClass: "risk-card-success animate-pulse-success",
				icon: <CheckCircle2 className="h-8 w-8 text-success" />,
				badgeClass: "bg-success text-success-foreground",
				storageLabel: "Simpan Foto Terenkripsi (Compliance)",
			},
			MANUAL_REVIEW: {
				cardClass: "risk-card-warning animate-pulse-warning",
				icon: <AlertTriangle className="h-8 w-8 text-warning" />,
				badgeClass: "bg-warning text-warning-foreground",
				storageLabel: "Simpan Foto & Tandai Review",
			},
			REJECTED: {
				cardClass: "risk-card-danger animate-pulse-danger",
				icon: <XCircle className="h-8 w-8 text-danger" />,
				badgeClass: "bg-danger text-danger-foreground",
				storageLabel: null,
			},
		}[result.risk_level];

		// Tampilkan detail data dari API
		return (
			<Card className={`${config.cardClass} transition-all`}>
				<CardHeader className="flex flex-row items-center gap-4 pb-2">
					{config.icon}
					<div className="flex-1">
						<div className="flex items-center gap-2">
							<CardTitle className="text-lg">{result.nama}</CardTitle>
							<Badge className={config.badgeClass}>{result.risk_level}</Badge>
						</div>
						<p className="text-sm text-muted-foreground font-mono">
							NIK: {result.nik}
						</p>
					</div>
					<div className="text-right">
						<div className="text-3xl font-bold font-mono">
							{result.final_score}
						</div>
						<div className="text-xs text-muted-foreground">
							Final Trust Score
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm font-medium">{result.message}</p>

					{/* Detail Data */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm border rounded-md p-4 bg-background/60">
						<div>
							<span className="font-medium">Nama:</span> {result.nama}
						</div>
						<div>
							<span className="font-medium">NIK:</span> {result.nik}
						</div>
						<div>
							<span className="font-medium">Tempat Lahir:</span>{" "}
							{result.tempat_lahir}
						</div>
						<div>
							<span className="font-medium">Tanggal Lahir:</span>{" "}
							{result.tanggal_lahir}
						</div>
						<div>
							<span className="font-medium">Jenis Kelamin:</span>{" "}
							{result.jenis_kelamin}
						</div>
						<div>
							<span className="font-medium">Alamat:</span> {result.alamat}
						</div>
						<div>
							<span className="font-medium">RT/RW:</span> {result.rt}/
							{result.rw}
						</div>
						<div>
							<span className="font-medium">Kelurahan:</span> {result.kelurahan}
						</div>
						<div>
							<span className="font-medium">Kecamatan:</span> {result.kecamatan}
						</div>
						<div>
							<span className="font-medium">Kota/Kabupaten:</span>{" "}
							{result.kota_kabupaten}
						</div>
						<div>
							<span className="font-medium">Provinsi:</span> {result.provinsi}
						</div>
						<div>
							<span className="font-medium">Agama:</span> {result.agama}
						</div>
						<div>
							<span className="font-medium">Status Perkawinan:</span>{" "}
							{result.status_perkawinan}
						</div>
						<div>
							<span className="font-medium">Pekerjaan:</span> {result.pekerjaan}
						</div>
						<div>
							<span className="font-medium">Kewarganegaraan:</span>{" "}
							{result.kewarganegaraan}
						</div>
						<div>
							<span className="font-medium">Masa Berlaku:</span>{" "}
							{result.masa_berlaku}
						</div>
					</div>

					{/* Reason List */}
					{result.reason && Array.isArray(result.reason) && (
						<div className="pt-2">
							<div className="font-medium mb-1">Alasan/Reason:</div>
							<ul className="list-disc pl-5 text-sm text-muted-foreground">
								{result.reason.map((r: string, i: number) => (
									<li key={i}>{r}</li>
								))}
							</ul>
						</div>
					)}

					{/* Skor */}
					{/*<div className="space-y-3 pt-2">
						<ScoreBar label="Identity Score" score={result.identity_score} />
						<ScoreBar label="Security Score" score={result.security_score} />
						<ScoreBar label="CDD Score" score={result.cdd_score} />
					</div>*/}

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
				<p className="text-muted-foreground text-sm mt-1">
					Verification Simulator & Trust Score Calculator
				</p>
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
							<Button onClick={runVerification} size="lg">
								Run Verification
							</Button>
						</div>
					</div>
					<p className="text-xs text-muted-foreground mt-2">
						Tip: Use a NIK from the Dukcapil database or a Blacklist NIK to test
						different scenarios
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

			{/* Loading */}
			{loading && (
				<div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
					<span className="text-sm font-medium">Memproses verifikasi...</span>
				</div>
			)}

			{/* Result */}
			{result && <ResultCard result={result} />}

			{/* Object Storage Status */}
			{/*<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>*/}
		</div>
	);
}
