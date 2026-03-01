/** @format */

import { useState } from "react";

import { Pencil, Plus, Search, ShieldAlert, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { createAuditLog, initialBlacklist } from "@/lib/mock-data";
import { useAuditStore } from "@/stores/audit-store";
import { BlacklistEntry } from "@/types/kyc";

export default function BlacklistPage() {
	const [entries, setEntries] = useState<BlacklistEntry[]>(initialBlacklist);
	const [search, setSearch] = useState("");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editing, setEditing] = useState<BlacklistEntry | null>(null);
	const [form, setForm] = useState({
		nik: "",
		nama: "",
		alasan_blacklist: "Fraud" as BlacklistEntry["alasan_blacklist"],
	});
	const addLog = useAuditStore((s) => s.addLog);

	const filtered = entries.filter(
		(e) =>
			e.nik.includes(search) ||
			e.nama.toLowerCase().includes(search.toLowerCase()),
	);

	const handleSave = () => {
		if (editing) {
			setEntries((prev) =>
				prev.map((e) => (e.id === editing.id ? { ...e, ...form } : e)),
			);
			addLog(createAuditLog("Admin", "Edit Blacklist", `NIK: ${form.nik}`));
		} else {
			const newEntry: BlacklistEntry = {
				id: Date.now(),
				...form,
				tanggal_ditambahkan: new Date().toISOString().split("T")[0],
			};
			setEntries((prev) => [...prev, newEntry]);
			addLog(createAuditLog("Admin", "Add Blacklist", `NIK: ${form.nik}`));
		}
		setDialogOpen(false);
		setEditing(null);
		setForm({ nik: "", nama: "", alasan_blacklist: "Fraud" });
	};

	const handleDelete = (entry: BlacklistEntry) => {
		setEntries((prev) => prev.filter((e) => e.id !== entry.id));
		addLog(createAuditLog("Admin", "Delete Blacklist", `NIK: ${entry.nik}`));
	};

	const handleEdit = (entry: BlacklistEntry) => {
		setEditing(entry);
		setForm({
			nik: entry.nik,
			nama: entry.nama,
			alasan_blacklist: entry.alasan_blacklist,
		});
		setDialogOpen(true);
	};

	const reasonBadge = (reason: string) => {
		const colors: Record<string, string> = {
			PEP: "bg-warning/20 text-warning border-warning/30",
			Kriminal: "bg-danger/20 text-danger border-danger/30",
			Fraud: "bg-destructive/20 text-destructive border-destructive/30",
		};
		return (
			<Badge variant="outline" className={colors[reason] || ""}>
				{reason}
			</Badge>
		);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
						<ShieldAlert className="h-6 w-6 text-danger" />
						VeriLabs Blacklist Management
					</h1>
					<p className="text-muted-foreground text-sm mt-1">
						Internal ApsaraDB — Manage flagged identities
					</p>
				</div>
				<Dialog
					open={dialogOpen}
					onOpenChange={(open) => {
						setDialogOpen(open);
						if (!open) {
							setEditing(null);
							setForm({ nik: "", nama: "", alasan_blacklist: "Fraud" });
						}
					}}
				>
					<DialogTrigger asChild>
						<Button>
							<Plus className="h-4 w-4 mr-2" />
							Add Entry
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								{editing ? "Edit" : "Add"} Blacklist Entry
							</DialogTitle>
						</DialogHeader>
						<div className="space-y-4 pt-2">
							<div>
								<Label>NIK</Label>
								<Input
									value={form.nik}
									onChange={(e) => setForm({ ...form, nik: e.target.value })}
									placeholder="16-digit NIK"
									maxLength={16}
								/>
							</div>
							<div>
								<Label>Nama</Label>
								<Input
									value={form.nama}
									onChange={(e) => setForm({ ...form, nama: e.target.value })}
									placeholder="Full name"
								/>
							</div>
							<div>
								<Label>Alasan Blacklist</Label>
								<Select
									value={form.alasan_blacklist}
									onValueChange={(v) =>
										setForm({
											...form,
											alasan_blacklist: v as BlacklistEntry["alasan_blacklist"],
										})
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="PEP">PEP</SelectItem>
										<SelectItem value="Kriminal">Kriminal</SelectItem>
										<SelectItem value="Fraud">Fraud</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<Button onClick={handleSave} className="w-full">
								{editing ? "Update" : "Save"}
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			<div className="relative max-w-sm">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Search by NIK or Name..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="pl-9"
				/>
			</div>

			<div className="rounded-lg border bg-card overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow className="bg-muted/50">
							<TableHead className="w-16">ID</TableHead>
							<TableHead>NIK</TableHead>
							<TableHead>Nama</TableHead>
							<TableHead>Alasan</TableHead>
							<TableHead>Tanggal Ditambahkan</TableHead>
							<TableHead className="w-28 text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filtered.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center text-muted-foreground py-8"
								>
									No entries found
								</TableCell>
							</TableRow>
						) : (
							filtered.map((entry) => (
								<TableRow key={entry.id}>
									<TableCell className="font-mono text-xs">
										{entry.id}
									</TableCell>
									<TableCell className="font-mono text-sm">
										{entry.nik}
									</TableCell>
									<TableCell className="font-medium">{entry.nama}</TableCell>
									<TableCell>{reasonBadge(entry.alasan_blacklist)}</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{entry.tanggal_ditambahkan}
									</TableCell>
									<TableCell className="text-right">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleEdit(entry)}
										>
											<Pencil className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleDelete(entry)}
										>
											<Trash2 className="h-4 w-4 text-danger" />
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
