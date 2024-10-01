import * as Actions from "@/lib/actions";
import { HaruFileNew } from "../types";

async function doUpload(type: string, params: Record<string, any>, file: File) {
  const presignedResponse = await fetch(`/api/upload/${type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const presignedResponseJson = await presignedResponse.json();
  if (presignedResponse.status !== 200) {
    throw new Error(
      `PresignedUrlFailed ${presignedResponseJson.error}: ${JSON.stringify(params)}`,
    );
  }

  const { url, fileUrl, fields } = presignedResponseJson;
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value as string);
  });
  formData.append("file", file);

  const uploadResponse = await fetch(url, { method: "POST", body: formData });
  if (!uploadResponse.ok) {
    console.log("upload response: ", uploadResponse, uploadResponse.body);
    throw new Error("UploadFailed");
  }
  return fileUrl;
}

export async function uploadAvatarFile(file: File) {
  const params = {
    filename: file.name,
    contentType: file.type,
  };
  const fileUrl = await doUpload("avatar", params, file);
  return await Actions.updateAvatarForUser(fileUrl);
}

export async function uploadReportFile(reportId: number, file: File) {
  const params = {
    filename: file.name,
    contentType: file.type,
    reportId,
  };
  const fileUrl = await doUpload("report", params, file);
  const actionParams: HaruFileNew = {
    type: file.type,
    filename: file.name,
    filesize: file.size,
    url: fileUrl,
  };
  return Actions.addSiteReportFile(reportId, actionParams);
}

// TODO can be merged into one function
export async function uploadReportSectionFile(sectionId: number, file: File) {
  const params = {
    filename: file.name,
    contentType: file.type,
    sectionId,
  };
  const fileUrl = await doUpload("section", params, file);
  const actionParams: HaruFileNew = {
    type: file.type,
    filename: file.name,
    filesize: file.size,
    url: fileUrl,
  };
  return Actions.addSiteReportSectionFile(sectionId, actionParams);
}
