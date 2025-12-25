export const runtime = 'edge';

export function GET() {
  return new Response(
    `User-agent: *
Allow: /

Sitemap: https://tovernet.online/sitemap.xml
`,
    {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400'
      }
    }
  );
}
