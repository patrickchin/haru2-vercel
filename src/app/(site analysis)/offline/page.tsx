"use client";

import { DefaultLayout } from "@/components/page-layouts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideDownload, LucideEye } from "lucide-react";
import Link from "next/link";

export default function Page() {
  async function handleDownload() {
    const res = await fetch("/offline.html");
    const blob = await res.blob();
    // Use File System Access API if available
    if ("showSaveFilePicker" in window) {
      // @ts-ignore
      const handle = await window.showSaveFilePicker({
        suggestedName: "harpa-pro-offline-report-form.html",
        types: [
          {
            description: "HTML File",
            accept: { "text/html": [".html"] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } else {
      // Fallback: use a temporary <a> element to trigger download with filename
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "harpa-pro-offline-report-form.html";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    }
  }

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
            <Button onClick={handleDownload}>
              Download <LucideDownload className="w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
}
