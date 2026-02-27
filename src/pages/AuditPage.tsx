import { useAuditStore } from "@/stores/audit-store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText } from "lucide-react";

export default function AuditPage() {
  const logs = useAuditStore((s) => s.logs);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Audit Logs
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Compliance activity tracking</p>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Admin</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Data Accessed</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No audit logs yet. Perform actions to generate logs.
                </TableCell>
              </TableRow>
            ) : logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{log.admin_name}</TableCell>
                <TableCell className="text-sm">{log.action}</TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">{log.data_accessed}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(log.timestamp).toLocaleString('id-ID')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {logs.length > 0 && (
        <div className="text-xs text-muted-foreground border-t pt-4">
          Audit Log: {logs[0].admin_name} accessed {logs[0].data_accessed} at {new Date(logs[0].timestamp).toLocaleString('id-ID')}
        </div>
      )}
    </div>
  );
}
