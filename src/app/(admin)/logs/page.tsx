import { DefaultLayout } from "@/components/page-layouts";
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

export default async function Page() {
  const session = await auth();
  if (session?.user?.role !== "admin") notFound();

  const logs = await listLogMessages();

  return (
    <DefaultLayout>
      <div className="flex items-center">
        <h1 className="grow text-3xl font-semibold">Log Messages</h1>
      </div>

      <Table className="border rounded">
        <TableHeader>
          <TableRow className="[&>th]:border-r [&>th]:whitespace-nowrap">
            <TableHead className="w-1">Time</TableHead>
            <TableHead className="w-1">User Id</TableHead>
            <TableHead className="w-full">Message</TableHead>
            <TableHead className="w-1">Site Id</TableHead>
            <TableHead className="w-1">Report Id</TableHead>
            <TableHead className="w-1">Meeting Id</TableHead>
            <TableHead className="w-1">Invitation Id</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs?.map((l, i) => (
            <TableRow key={l.id} className="[&>td]:border-r ">
              <TableCell className="whitespace-nowrap">
                {l.createdAt.toISOString()}
              </TableCell>
              <TableCell>{l.userId}</TableCell>
              <TableCell>{l.message}</TableCell>
              <TableCell>{l.siteId}</TableCell>
              <TableCell>{l.reportId}</TableCell>
              <TableCell>{l.meetingId}</TableCell>
              <TableCell>{l.invitationId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DefaultLayout>
  );
}
