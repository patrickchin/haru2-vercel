"use client";

import { ChangeEvent, ReactNode, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { HaruFile, SiteDetails, SiteMemberRole } from "@/lib/types";
import { uploadSiteFile } from "@/lib/utils/upload";
import prettyBytes from "pretty-bytes";
import * as Actions from "@/lib/actions";

import { toast } from "@/lib/hooks/use-toast";
import {
  LucideDownload,
  LucideLoader2,
  LucidePlus,
  LucideTrash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function DeleteFileButton({
  children,
  siteId,
  fileId,
  onDelete,
}: {
  children?: ReactNode;
  siteId: number;
  fileId: number;
  onDelete?: () => void;
}) {
  const form = useForm();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you would like to delete this file?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async () => {
                await Actions.deleteSiteFile({ siteId, fileId });
                console.log("xxx");
                onDelete && onDelete();
              })}
            >
              <Button asChild variant="destructive">
                <AlertDialogAction type="submit">
                  Yes, Delete File
                  {form.formState.isSubmitting && (
                    <LucideLoader2 className="animate-spin h-4" />
                  )}
                </AlertDialogAction>
              </Button>
            </form>
          </Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function SiteFiles({
  site,
  role,
}: {
  site: SiteDetails;
  role: SiteMemberRole;
}) {
  const {
    data: files,
    mutate: mutateFiles,
    isLoading,
  } = useSWR<HaruFile[]>(
    `/api/site/${site.id}/files`,
    async () => (await Actions.listSiteFiles({ siteId: site.id })) ?? [],
  );

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
        <CardTitle className="py-6">Site Documents and Other Files</CardTitle>
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
              <TableRow className="[&>th]:px-3 [&>th]:border-r [&>th]:whitespace-nowrap">
                <TableHead className="w-1">Id</TableHead>
                <TableHead className="w-full">Filename</TableHead>
                <TableHead className="w-1">Size</TableHead>
                <TableHead className="w-1">Uploader</TableHead>
                <TableHead className="w-1">Date</TableHead>
                <TableHead className="w-1"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files && files.length > 0 ? (
                files.map((f) => (
                  <TableRow
                    key={f.id}
                    className="[&>td]:px-3 [&>td]:border-r whitespace-nowrap"
                  >
                    <TableCell>{f.id}</TableCell>
                    <TableCell>{f.filename}</TableCell>
                    <TableCell>
                      {f.filesize ? prettyBytes(f.filesize) : "--"}
                    </TableCell>
                    <TableCell>{f.uploader?.name ?? "--"}</TableCell>
                    <TableCell>{f.uploadedAt.toDateString()}</TableCell>
                    <TableCell className="text-center space-x-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={f.url || "/not-found"} target="_blank">
                          <LucideDownload />
                        </Link>
                      </Button>
                      <DeleteFileButton
                        onDelete={() => mutateFiles()}
                        siteId={site.id}
                        fileId={f.id}
                      >
                        <Button variant="outline" size="icon">
                          <LucideTrash2 />
                        </Button>
                      </DeleteFileButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={999} className="p-8 bg-muted text-center">
                    {isLoading ? "Loading ..." : "No uploaded files"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
