import { NextRequest, NextResponse } from "next/server";
import { getContentBySlug } from "@/lib/content";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug: slugArray } = await params;
  const searchParams = request.nextUrl.searchParams;
  
  let isMarkdownRequest = searchParams.get("as") === "md";
  let pathStr = slugArray.join("/");
  
  if (pathStr.endsWith(".md")) {
    isMarkdownRequest = true;
    pathStr = pathStr.replace(/\.md$/, "");
  }

  if (!isMarkdownRequest) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Assume the last two parts of the slug are the type and the content slug
  // e.g., ["docs", "components", "sheet"] -> type="components", contentSlug="sheet"
  const type = slugArray[slugArray.length - 2];
  const contentSlug = slugArray[slugArray.length - 1].replace(/\.md$/, "");

  if (!type || !contentSlug) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const item = getContentBySlug(type, contentSlug);

  if (!item) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Strip JSX from MDX
  let markdown = item.content;
  // Remove imports
  markdown = markdown.replace(/^import\s+.*?\s+from\s+['"].*?['"];?\n/gm, '');
  // Remove standard JSX components (naive)
  markdown = markdown.replace(/<[A-Z][a-zA-Z]*[^>]*>/g, '');
  markdown = markdown.replace(/<\/[A-Z][a-zA-Z]*>/g, '');
  
  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown",
    },
  });
}
