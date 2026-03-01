/** @format */

import { useEffect, useState } from "react";

import {
	AlertTriangle,
	CheckCircle2,
	ClipboardList,
	Minus,
	Search,
	TrendingDown,
	TrendingUp,
	XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

function ScoreTrend({ trend }: { trend: string }) {
	if (trend === "up") return <TrendingUp className="h-4 w-4 text-success" />;
	if (trend === "down") return <TrendingDown className="h-4 w-4 text-danger" />;
	return <Minus className="h-4 w-4 text-warning" />;
}

const riskConfig: Record<
	string,
	{ icon: React.ReactNode; badgeClass: string; label: string }
> = {
	"Auto Approved": {
		icon: <CheckCircle2 className="h-4 w-4 text-success" />,
		badgeClass: "bg-success/15 text-success border-success/30",
		label: "Auto Approved",
	},
	"Manual Review": {
		icon: <AlertTriangle className="h-4 w-4 text-warning" />,
		badgeClass: "bg-warning/15 text-warning border-warning/30",
		label: "Manual Review",
	},
	Rejected: {
		icon: <XCircle className="h-4 w-4 text-danger" />,
		badgeClass: "bg-danger/15 text-danger border-danger/30",
		label: "Rejected",
	},
};

export default function VerificationResultsPage() {
	const [search, setSearch] = useState("");
	const [filterRisk, setFilterRisk] = useState<string>("all");
	const [results, setResults] = useState<any[]>([]);
	const [stats, setStats] = useState({
		total: 0,
		approved: 0,
		review: 0,
		rejected: 0,
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const API_URL = import.meta.env.VITE_API_URL;

	const fetchResults = async () => {
		if (!API_URL) {
			setError("API_URL tidak ditemukan");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const params = new URLSearchParams();
			if (search) params.append("search", search);
			if (filterRisk !== "all") params.append("status", filterRisk);

			const res = await fetch(
				`${API_URL}/v1/kyc/verification-results?${params.toString()}`,
			);

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Gagal mengambil data");
			}

			setResults(data.data || []);
			setStats({
				total: data.summary?.total || 0,
				approved: data.summary?.approved || 0,
				review: data.summary?.manual || 0,
				rejected: data.summary?.rejected || 0,
			});
		} catch (e: any) {
			setError(e.message || "Gagal mengambil data");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchResults();
	}, [search, filterRisk]);

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

			{/* Summary */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="pt-6 text-center">
						<p className="text-3xl font-bold font-mono">{stats.total}</p>
						<p className="text-xs text-muted-foreground mt-1">
							Total Verifikasi
						</p>
					</CardContent>
				</Card>

				<Card className="border-success/30">
					<CardContent className="pt-6 text-center">
						<p className="text-3xl font-bold font-mono text-success">
							{stats.approved}
						</p>
						<p className="text-xs text-muted-foreground mt-1">Approved</p>
					</CardContent>
				</Card>

				<Card className="border-warning/30">
					<CardContent className="pt-6 text-center">
						<p className="text-3xl font-bold font-mono text-warning">
							{stats.review}
						</p>
						<p className="text-xs text-muted-foreground mt-1">Manual Review</p>
					</CardContent>
				</Card>

				<Card className="border-danger/30">
					<CardContent className="pt-6 text-center">
						<p className="text-3xl font-bold font-mono text-danger">
							{stats.rejected}
						</p>
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
						<SelectItem value="Auto Approved">Auto Approved</SelectItem>
						<SelectItem value="Manual Review">Manual Review</SelectItem>
						<SelectItem value="Rejected">Rejected</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Table */}
			<Card>
				<CardContent className="p-0">
					{loading ? (
						<div className="text-center py-12 text-muted-foreground">
							Loading...
						</div>
					) : error ? (
						<div className="text-center py-12 text-red-500">{error}</div>
					) : (
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
								{results.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={10}
											className="text-center py-12 text-muted-foreground"
										>
											Belum ada hasil verifikasi.
										</TableCell>
									</TableRow>
								) : (
									results.map((r, i) => {
										const cfg = riskConfig[r.status] || riskConfig["Rejected"];

										return (
											<TableRow key={i}>
												<TableCell className="font-mono text-sm">
													{r.nik}
												</TableCell>
												<TableCell className="font-medium">{r.nama}</TableCell>
												<TableCell className="text-center font-mono">
													{r.identity_score}
												</TableCell>
												<TableCell className="text-center font-mono">
													{r.security_score}
												</TableCell>
												<TableCell className="text-center font-mono">
													{r.cdd_score}
												</TableCell>
												<TableCell className="text-center">
													<span className="font-mono font-bold text-lg">
														{r.final_score}
													</span>
												</TableCell>
												<TableCell className="text-center">
													<Badge
														variant="outline"
														className="font-mono font-bold"
													>
														{r.grade}
													</Badge>
												</TableCell>
												<TableCell>{r.predikat}</TableCell>
												<TableCell>
													<Badge
														variant="outline"
														className={`${cfg.badgeClass} gap-1`}
													>
														{cfg.icon}
														{cfg.label}
													</Badge>
												</TableCell>
												<TableCell className="text-center">
													<ScoreTrend trend={r.trend} />
												</TableCell>
											</TableRow>
										);
									})
								)}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
