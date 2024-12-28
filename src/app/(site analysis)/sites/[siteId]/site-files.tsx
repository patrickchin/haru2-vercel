"use client";

import {
    HaruFile,
  SiteDetails,
  SiteMemberRole,
} from "@/lib/types";
import * as Actions from "@/lib/actions";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { LucideLoader2, LucidePlus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import { uploadSiteFile } from "@/lib/utils/upload";
import { toast } from "@/lib/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function SiteFiles({
  site,
  role,
}: {
  site: SiteDetails;
  role: SiteMemberRole;
}) {
  const { data: files, mutate: mutateFiles } = useSWR<HaruFile[]>(
    `/api/site/${site.id}/files`,
    async () => (await Actions.listSiteFiles({ siteId: site.id })) ?? [],
  );

//   async function handleFileDelete(file: HaruFile) {
//     try {
//       await Actions.deleteSiteFile({ siteId, fileId: file.id });
//       await mutateFiles(); // Refresh the file list after deletion
//       toast({ description: `File deleted successfully: ${file.filename}` });
//     } catch (e) {
//       toast({ description: `Delete Error: ${e}` });
//     }
//   }

  const [isUploading, setIsUploading] = useState(false);

  async function onChangeUploadFile(e: ChangeEvent<HTMLInputElement>) {
    const targetFiles = e.currentTarget.files;
    if (!targetFiles || targetFiles.length <= 0) return;
    setIsUploading(true);
    try {
      for (const file of Array.from(targetFiles)) {
        const f = await uploadSiteFile({ siteId: site.id, file });
        mutateFiles();
      }
      e.target.value = "";
    } catch (e) {
      toast({ description: `Error: ${e}` });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row py-0 items-baseline gap-4">
        <CardTitle className="py-6">Site Documents and other Files</CardTitle>
        <Button asChild disabled={isUploading} variant="default">
          <Label
            htmlFor={`upload-file-site-${site.id}`}
            className="rounded hover:cursor-pointer flex gap-2 disabled:pointer-events-none disabled:opacity-50"
          >
            <Input
              type="file"
              id={`upload-file-site-${site.id}`}
              className="hidden"
              onChange={onChangeUploadFile}
              disabled={isUploading}
              multiple
            />
            <span className="capitalize">Upload File</span>
            {isUploading ? (
              <LucideLoader2 className="animate-spin h-5 w-5" />
            ) : (
              <LucidePlus className="w-4 h-4" />
            )}
          </Label>
        </Button>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <Table className="border rounded">
            <TableHeader>
              <TableRow className="[&>th]:border-r [&>th]:whitespace-nowrap">
                <TableHead className="w-1">File Id</TableHead>
                <TableHead className="w-1">Filename</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files?.map((f) => (
                <TableRow key={f.id} className="[&>td]:border-r ">
                  <TableCell>{f.id}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {f.filename}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

