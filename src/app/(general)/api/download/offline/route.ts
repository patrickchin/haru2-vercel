import { NextResponse } from "next/server";
import { join } from "path";
import { readFileSync } from "fs";

export async function GET() {
  const filePath = join(process.cwd(), "public", "offline.html");
  const fileContents = readFileSync(filePath);

  return new NextResponse(fileContents, {
    headers: {
      "Content-Type": "text/html",
      "Content-Disposition": 'attachment; filename="offline.html"',
    },
  });
}
