import { DefaultLayout } from "@/components/page-layouts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listLogMessages } from "@/db";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  if (session?.user?.role !== "admin") notFound();

  const searchParams = await props.searchParams;
  const filter =
    typeof searchParams["f"] === "string" ? searchParams["tab"] : undefined;

  const logs = await listLogMessages();

  return (
    <DefaultLayout>
      <h1 className="grow text-2xl font-semibold">Log Messages</h1>
      <div className="border rounded">
        <Table>
          <TableHeader>
            <TableRow className="[&>th]:border-r last:[&>th]:last:border-r-0 [&>th]:px-2 [&>th]:whitespace-nowrap">
              <TableHead className="w-1">Id</TableHead>
              <TableHead className="w-1">Date</TableHead>
              <TableHead className="w-1">Time</TableHead>
              <TableHead className="w-1">User Id</TableHead>
              <TableHead className="w-full">Message</TableHead>
              <TableHead className="w-1">Site Id</TableHead>
              <TableHead className="w-1">Report Id</TableHead>
              <TableHead className="w-1">Invitation Id</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs?.map((l) => (
              <TableRow
                key={l.id}
                className="[&>td]:border-r last:[&_td]:border-r-0 [&>td]:px-2 [&>td]:whitespace-nowrap"
              >
                <TableCell>{l.id}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {l.createdAt.toLocaleDateString()}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {l.createdAt.toLocaleTimeString()}
                </TableCell>
                <TableCell>{l.userId}</TableCell>
                <TableCell>{l.message}</TableCell>
                <TableCell>{l.siteId}</TableCell>
                <TableCell>{l.reportId}</TableCell>
                <TableCell>{l.invitationId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DefaultLayout>
  );
}
