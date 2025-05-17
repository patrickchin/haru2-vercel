"use client";

import { DefaultLayout } from "@/components/page-layouts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideDownload, LucideEye } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <DefaultLayout>
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <h1 className="grow text-2xl font-semibold">Offline Form Download</h1>
      </div>

      <Card className="mt-8 bg-muted">
        <CardContent className="py-20 text-center">
          <p>
            Download the offline form to fill out. When you&apos;re back online
            you can upload the form to a new site report.
          </p>
          <div className="flex gap-4 mt-4 justify-center">
            <Button asChild variant="secondary">
              <Link href="offline.html">
                View <LucideEye className="w-4" />
              </Link>
            </Button>
            <Button asChild>
              <Link href="/api/download/offline">
                Download <LucideDownload className="w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
}
