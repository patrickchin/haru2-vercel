import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page({ params }: { params: { siteId: string } }) {
  const siteId = Number(params.siteId);
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="grow flex flex-col items-center px-16 py-8 gap-4">
        <h3>Site {siteId} Description Page</h3>
        <p>Some description of the site</p>
        <Button>
          <Link href={`/site/${siteId}/reports`}>
            Click Here to View Reports
          </Link>
        </Button>
      </main>

      <Footer />
    </div>
  );
}