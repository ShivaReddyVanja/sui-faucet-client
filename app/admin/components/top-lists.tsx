import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopWallet, TopIp } from "@/lib/types";

interface TopListsProps {
  topWallets: TopWallet[];
  topIps: TopIp[];
}

export function TopLists({ topWallets, topIps }: TopListsProps) {
  return (
    <div className="grid gap-6">
      <Card className="bg-sui-cloud/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 text-sui-cloud">
        <CardHeader>
          <CardTitle className="text-lg">Top 5 Wallets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-sui-aqua">Wallet Address</TableHead>
                <TableHead className="text-right text-sui-aqua">Requests</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topWallets.map((wallet, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-xs md:text-sm">
                    {shortenAddress(wallet.walletAddress)}
                  </TableCell>
                  <TableCell className="text-right">{wallet._count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-sui-cloud/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 text-sui-cloud">
        <CardHeader>
          <CardTitle className="text-lg">Top 5 IPs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-sui-aqua">IP Address</TableHead>
                <TableHead className="text-right text-sui-aqua">Requests</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topIps.map((ip, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{ip.ipAddress}</TableCell>
                  <TableCell className="text-right">{ip._count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Utility function
function shortenAddress(str: string, len = 6) {
  if (!str || str.length <= len * 2 + 2) return str;
  return `${str.slice(0, len)}...${str.slice(-len)}`;
}