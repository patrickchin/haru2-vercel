import * as Actions from "@/lib/actions";

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
    throw new Error("UploadFailed");
  }
  return fileUrl;
}

export async function uploadFile(
  args: ({ taskId: number } | { projectId: number }) & { file: File },
) {
  const taskId = "taskId" in args ? args.taskId : null;
  const projectId = "projectId" in args ? args.projectId : null;
  const params = {
    filename: args.file.name,
    contentType: args.file.type,
    ...(taskId !== null ? { taskId } : { projectId }),
  };
  const fileUrl = await doUpload(
    taskId !== null ? "task" : "project",
    params,
    args.file,
  );

  const actionParams = {
    type: args.file.type,
    name: args.file.name,
    size: args.file.size,
    fileUrl,
  };
  if (taskId) return Actions.addFile({ ...actionParams, taskId });
  if (projectId) return Actions.addFile({ ...actionParams, projectId });
}

export async function uploadAvatarFile(file: File) {
  const params = {
    filename: file.name,
    contentType: file.type,
  };
  const fileUrl = await doUpload("avatar", params, file);
  return await Actions.updateAvatarForUser(fileUrl);
}
