import { useState } from "react";
import { CitizenEntry } from "@/types/kyc";
import { initialCitizens, generateCitizens, createAuditLog } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Database, RefreshCw, Search } from "lucide-react";
import { useAuditStore } from "@/stores/audit-store";

export default function DukcapilPage() {
  const [citizens, setCitizens] = useState<CitizenEntry[]>(initialCitizens);
  const [search, setSearch] = useState("");
  const addLog = useAuditStore((s) => s.addLog);

  const filtered = citizens.filter((c) =>
    c.nik.includes(search) ||
    c.nama.toLowerCase().includes(search.toLowerCase()) ||
    c.kota.toLowerCase().includes(search.toLowerCase()) ||
    c.provinsi.toLowerCase().includes(search.toLowerCase())
  );

  const handleGenerate = () => {
    const newData = generateCitizens(20);
    setCitizens(newData);
    addLog(createAuditLog('Admin', 'Generate Dummy Data', `${newData.length} citizen records`));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            Indonesian Citizen Data (Dukcapil Simulation)
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Simulated population registry for KYC testing</p>
        </div>
        <Button onClick={handleGenerate} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />Generate Dummy Data
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search NIK, name, city, province..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">ID</TableHead>
                <TableHead>NIK</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Tgl Lahir</TableHead>
                <TableHead className="w-12">JK</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Kecamatan</TableHead>
                <TableHead>Kota</TableHead>
                <TableHead>Provinsi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No records found</TableCell></TableRow>
              ) : filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs">{c.id}</TableCell>
                  <TableCell className="font-mono text-sm">{c.nik}</TableCell>
                  <TableCell className="font-medium">{c.nama}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.tanggal_lahir}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={c.jenis_kelamin === 'L' ? 'bg-primary/10 text-primary border-primary/30' : 'bg-accent text-accent-foreground'}>
                      {c.jenis_kelamin}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm max-w-[150px] truncate">{c.alamat}</TableCell>
                  <TableCell className="text-sm">{c.kecamatan}</TableCell>
                  <TableCell className="text-sm">{c.kota}</TableCell>
                  <TableCell className="text-sm">{c.provinsi}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">Showing {filtered.length} of {citizens.length} records</p>
    </div>
  );
}
