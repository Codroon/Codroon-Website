import { NextResponse } from "next/server";
import { buildPreviews } from "@/emails/previewSet";
import { SITE } from "@/config/site";

/**
 * Feeds scripts/export-emails.mjs. DEV ONLY, same as the page.
 *
 * The exported files use the PRODUCTION origin for assets, not
 * localhost: these are meant to be pasted into a client-testing tool
 * later, where a localhost image URL would simply fail.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }
  return NextResponse.json(await buildPreviews(SITE.url));
}
