/** @format */

import { useEffect, useState } from "react";

import {
	AlertTriangle,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	ClipboardList,
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
	const [expanded, setExpanded] = useState<Record<string, boolean>>({});
	const [subExpanded, setSubExpanded] = useState<
		Record<string, Record<string, boolean>>
	>({});
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
		if (!API_URL) return setError("API_URL tidak ditemukan");

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
			console.log("🚀 ~ fetchResults ~ data:", data);
			if (!res.ok) throw new Error(data.error || "Gagal mengambil data");

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

	const toggleExpand = (id: string) => {
		setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	const toggleSubExpand = (id: string, section: string) => {
		setSubExpanded((prev) => ({
			...prev,
			[id]: { ...prev[id], [section]: !prev[id]?.[section] },
		}));
	};

	return (
		<div className="space-y-6">
			{/* Header & Summary */}
			<div>
				<h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
					<ClipboardList className="h-6 w-6 text-primary" /> Verification
					Results
				</h1>
				<p className="text-muted-foreground text-sm mt-1">
					Riwayat hasil verifikasi KYC — Score dan Status
				</p>
			</div>

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
									<TableHead></TableHead>
									<TableHead>NIK</TableHead>
									<TableHead>Nama</TableHead>
									<TableHead>Tempat Lahir</TableHead>
									<TableHead>Tanggal Lahir</TableHead>
									<TableHead>Jenis Kelamin</TableHead>
									<TableHead>Alamat</TableHead>
									<TableHead className="text-center">Identity</TableHead>
									<TableHead className="text-center">Risk</TableHead>
									<TableHead className="text-center">Compliance</TableHead>
									<TableHead className="text-center">Final Score</TableHead>
									<TableHead className="text-center">Timestamp</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{results.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={13}
											className="text-center py-12 text-muted-foreground"
										>
											Belum ada hasil verifikasi.
										</TableCell>
									</TableRow>
								) : (
									results.map((r) => {
										const cfg = riskConfig[r.status] || riskConfig["Rejected"];
										const isExpanded = expanded[r.idx];

										return (
											<>
												<TableRow
													key={r.idx}
													className="cursor-pointer"
													onClick={() => toggleExpand(r.idx)}
												>
													<TableCell className="text-center">
														{isExpanded ? (
															<ChevronUp className="h-4 w-4" />
														) : (
															<ChevronDown className="h-4 w-4" />
														)}
													</TableCell>
													<TableCell className="font-mono text-sm">
														{r.nik}
													</TableCell>
													<TableCell className="font-medium">
														{r.nama}
													</TableCell>
													<TableCell>{r.tempat_lahir}</TableCell>
													<TableCell>{r.tanggal_lahir}</TableCell>
													<TableCell>{r.jenis_kelamin}</TableCell>
													<TableCell className="font-mono">
														{r.alamat}
													</TableCell>
													<TableCell className="text-center font-mono">
														{r.identity_score}
													</TableCell>
													<TableCell className="text-center font-mono">
														{r.risk_score}
													</TableCell>
													<TableCell className="text-center font-mono">
														{r.compliance_score}
													</TableCell>
													<TableCell className="text-center">
														<span className="font-mono font-bold text-lg">
															{r.final_score}
														</span>
													</TableCell>
													<TableCell className="text-center font-mono">
														{r.created_at}
													</TableCell>
													<TableCell>
														<Badge
															variant="outline"
															className={`${cfg.badgeClass} gap-1`}
														>
															{cfg.icon} {cfg.label}
														</Badge>
													</TableCell>
												</TableRow>

												{isExpanded && (
													<TableRow className="bg-muted-foreground/10">
														<TableCell colSpan={13} className="p-4 space-y-3">
															{/* Reason Accordion */}
															<div className="border rounded p-2">
																<div
																	className="flex justify-between items-center cursor-pointer"
																	onClick={() =>
																		toggleSubExpand(r.idx, "reason")
																	}
																>
																	<strong>Reason</strong>
																	{subExpanded[r.idx]?.reason ? (
																		<ChevronUp />
																	) : (
																		<ChevronDown />
																	)}
																</div>
																{subExpanded[r.idx]?.reason && (
																	<ul className="list-disc pl-5 mt-2">
																		{r.reason.map(
																			(item: string, idx: number) => (
																				<li key={idx}>{item}</li>
																			),
																		)}
																	</ul>
																)}
															</div>

															{/* SERP Results Accordion */}
															<div className="border rounded p-2">
																<div
																	className="flex justify-between items-center cursor-pointer"
																	onClick={() =>
																		toggleSubExpand(r.idx, "serper")
																	}
																>
																	<strong>SERP Results</strong>
																	{subExpanded[r.idx]?.serper ? (
																		<ChevronUp />
																	) : (
																		<ChevronDown />
																	)}
																</div>
																{subExpanded[r.idx]?.serper && (
																	<div className="mt-2 space-y-2 text-sm">
																		{r.serper_result.organic.map(
																			(item: any, idx: number) => (
																				<div
																					key={idx}
																					className="border p-2 rounded bg-white/50"
																				>
																					<p>
																						<strong>{item.title}</strong>{" "}
																						<span className="text-muted-foreground text-xs">
																							({item.position})
																						</span>
																					</p>
																					<p className="text-blue-600 underline break-all">
																						<a href={item.link} target="_blank">
																							{item.link}
																						</a>
																					</p>
																					<p className="text-muted-foreground">
																						{item.snippet}
																					</p>
																					{item.date && (
																						<p className="text-muted-foreground text-xs">
																							Date: {item.date}
																						</p>
																					)}
																				</div>
																			),
																		)}
																	</div>
																)}
															</div>

															{/* Identity Compliance Accordion */}
															<div className="border rounded p-2">
																<div
																	className="flex justify-between items-center cursor-pointer"
																	onClick={() =>
																		toggleSubExpand(r.idx, "compliance")
																	}
																>
																	<strong>Identity Compliance</strong>
																	{subExpanded[r.idx]?.compliance ? (
																		<ChevronUp />
																	) : (
																		<ChevronDown />
																	)}
																</div>
																{subExpanded[r.idx]?.compliance && (
																	<div className="mt-2 space-y-2 text-sm">
																		<p>
																			<strong>Alasan:</strong>{" "}
																			{r.identity_compliance_result.alasan}
																		</p>
																		<p>
																			<strong>Identity Score:</strong>{" "}
																			{
																				r.identity_compliance_result
																					.identity_score
																			}
																		</p>
																		<p>
																			<strong>Compliance Score:</strong>{" "}
																			{
																				r.identity_compliance_result
																					.compliance_score
																			}
																		</p>
																	</div>
																)}
															</div>
														</TableCell>
													</TableRow>
												)}
											</>
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
