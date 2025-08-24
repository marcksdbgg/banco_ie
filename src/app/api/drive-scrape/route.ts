import { NextResponse } from 'next/server';

type Item = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parent?: string | null;
  href?: string;
};

async function scrapeFolderOnce(folderId: string) {
  const url = `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
  const resp = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!resp.ok) {
    throw new Error(`Failed to fetch folder ${folderId}: ${resp.status}`);
  }
  const text = await resp.text();

  const items: Item[] = [];

  // Find anchors; filter file and folder links
  const anchorRe = /<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gmi;
  let m: RegExpExecArray | null;
  const seen = new Set<string>();
  while ((m = anchorRe.exec(text)) !== null) {
    const href = m[1];
    let label = m[2].replace(/<[^>]+>/g, '').trim();
    if (!label) label = '';

    // File link pattern
    const fileMatch = href.match(/\/file\/d\/([A-Za-z0-9_-]+)/);
    if (fileMatch) {
      const id = fileMatch[1];
      if (seen.has(`f:${id}`)) continue;
      seen.add(`f:${id}`);
      items.push({ id, name: label || id, type: 'file', parent: folderId, href });
      continue;
    }

    // Folder link pattern
    const folderMatch = href.match(/\/drive\/folders\/([A-Za-z0-9_-]+)/);
    if (folderMatch) {
      const id = folderMatch[1];
      if (seen.has(`d:${id}`)) continue;
      seen.add(`d:${id}`);
      items.push({ id, name: label || id, type: 'folder', parent: folderId, href });
      continue;
    }
  }

  return items;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const root = searchParams.get('folderId');
    if (!root) return NextResponse.json({ error: 'folderId query param is required' }, { status: 400 });

    const maxItems = 2000; // safety cap
    const queue: string[] = [root];
    const results: Item[] = [];
    const visited = new Set<string>();

    while (queue.length > 0 && results.length < maxItems) {
      const folderId = queue.shift() as string;
      if (visited.has(folderId)) continue;
      visited.add(folderId);
      try {
        const items = await scrapeFolderOnce(folderId);
        for (const it of items) {
          results.push(it);
          if (it.type === 'folder' && !visited.has(it.id)) {
            queue.push(it.id);
          }
          if (results.length >= maxItems) break;
        }
      } catch (err) {
        // ignore folder errors but record a placeholder
        results.push({ id: folderId, name: `__error_loading_${folderId}__`, type: 'folder', parent: null });
      }
    }

    return NextResponse.json({ items: results });
  } catch (error: any) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
