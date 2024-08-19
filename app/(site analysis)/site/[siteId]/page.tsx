import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page({ params }: { params: { siteId: string } }) {
  const siteId = Number(params.siteId);
  return (
    <>
      <h3>Site Description Page</h3>
      <p>Some description of hte site</p>
      <Button>
        <Link href={`/site/${siteId}/reports`}>Click Here to View Reports</Link>
      </Button>
    </>
  );
}