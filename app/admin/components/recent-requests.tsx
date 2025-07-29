import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RecentRequest } from "@/lib/types";

interface RecentRequestsTableProps {
  requests: RecentRequest[];
}

export function RecentRequestsTable({ requests }: RecentRequestsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-sui-aqua whitespace-nowrap font-semibold">Wallet</TableHead>
            <TableHead className="text-sui-aqua whitespace-nowrap font-semibold ">IP Address</TableHead>
            <TableHead className="text-sui-aqua whitespace-nowrap font-semibold">Status</TableHead>
            <TableHead className="text-sui-aqua whitespace-nowrap font-semibold">Transaction Hash</TableHead>
            <TableHead className="text-sui-aqua whitespace-nowrap font-semibold">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id} className="">
              <TableCell className="text-xs md:text-sm font-mono">
                {shortenAddress(request.walletAddress)}
              </TableCell>
              <TableCell className="text-xs md:text-sm">{request.ipAddress}</TableCell>
              <TableCell>
                <Badge variant={request.status === "success" ? "default" : "destructive"}>
                  {request.status.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-xs md:text-sm truncate max-w-[160px] font-mono">
                {request.txHash ? shortenAddress(request.txHash, 10) : "—"}
              </TableCell>
              <TableCell className="text-xs md:text-sm text-gray-600">
                {formatDate(request.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Utility functions
function shortenAddress(str: string, len = 6) {
  if (!str || str.length <= len * 2 + 2) return str;
  return `${str.slice(0, len)}...${str.slice(-len)}`;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}