import { getIconSvg } from '@/lib/icon-assets';

export async function GET(request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const source = await getIconSvg(name);

  if (!source) {
    return new Response('Icon not found', { status: 404 });
  }

  const preview = new URL(request.url).searchParams.has('preview');
  const svg = preview ? source.replaceAll('currentColor', '#18181B') : source;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
