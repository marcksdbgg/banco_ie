'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

type Item = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parent?: string | null;
  href?: string;
};

export default function DocumentosPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);

  // Root folder provided by the user
  const ROOT_FOLDER = '1D75tarMF-L1ImsWw4XT00bpb4O8OcCLw';

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/drive-scrape?folderId=${ROOT_FOLDER}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || 'Error fetching');
        setItems(json.items || []);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const openPreview = (it: Item) => {
    // Only attempt to preview files (not folders)
    if (it.type === 'folder') return window.open(`https://drive.google.com/drive/folders/${it.id}`, '_blank', 'noopener');

    // Infer preview URL by file ID and simple heuristics (PDF/images use file preview)
    const previewUrl = `https://drive.google.com/file/d/${it.id}/preview`;
    setPreviewSrc(previewUrl);
    setPreviewName(it.name);
  };

  const closePreview = () => {
    setPreviewSrc(null);
    setPreviewName(null);
  };

  const folders = items.filter(i => i.type === 'folder');
  const files = items.filter(i => i.type === 'file');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Repositorio de Documentos</h1>
            <p className="text-gray-600">Accede y previsualiza recursos de la carpeta raíz de Drive (lectura pública mediante scraping).</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Button variant="outline">Volver al inicio</Button>
            </Link>
            <a href={`https://drive.google.com/drive/folders/${ROOT_FOLDER}`} target="_blank" rel="noreferrer">
              <Button variant="munay">Abrir carpeta raíz en Drive</Button>
            </a>
          </div>
        </header>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Carpetas ({folders.length})</h2>
            <div className="text-sm text-muted-foreground">Archivos encontrados: {files.length}</div>
          </div>

          {loading && <div className="text-gray-600">Escaneando carpeta raíz, por favor espera...</div>}
          {error && <div className="text-red-600">Error: {error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {folders.map((f) => (
              <Card key={`d-${f.id}`} className="border-2 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-munay-blue">{f.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">Carpeta</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">ID: {f.id}</div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" onClick={() => window.open(`https://drive.google.com/drive/folders/${f.id}`, '_blank', 'noopener')}>Abrir carpeta</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Archivos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {files.map((it) => (
                <Card key={`f-${it.id}`} className="border-2 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-munay-blue">{it.name}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">Archivo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">ID: {it.id}</div>
                      <div className="flex items-center space-x-2">
                        <Button variant="munay" onClick={() => openPreview(it)}>Ver</Button>
                        <a href={`https://drive.google.com/file/d/${it.id}/view`} target="_blank" rel="noreferrer">
                          <Button variant="outline">Abrir en Drive</Button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Dialog */}
        <Dialog open={!!previewSrc} onOpenChange={(open) => { if (!open) closePreview(); }}>
          <DialogContent className="max-w-4xl w-full">
            <DialogHeader>
              <DialogTitle>{previewName ?? 'Previsualización'}</DialogTitle>
              <DialogDescription>Vista previa del recurso. Si el archivo no se puede embeber, se abrirá en Drive.</DialogDescription>
            </DialogHeader>

            <div className="h-[70vh]">
              {previewSrc ? (
                <iframe title="drive-preview" src={previewSrc} className="w-full h-full border rounded-md" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">No hay archivo seleccionado</div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closePreview}>Cerrar</Button>
              {previewSrc && (
                <a href={previewSrc.replace('/preview', '/view')} target="_blank" rel="noreferrer">
                  <Button variant="munay">Abrir en Drive</Button>
                </a>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
