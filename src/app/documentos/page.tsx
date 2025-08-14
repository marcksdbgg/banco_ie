'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

// Lista inicial basada en los links proporcionados. Los IDs pueden extraerse de los enlaces de Drive.
const archivos = [
  { nombre: 'Secundaria Módulo 1', id: '1VW5Dq4gn_gL2WqFx-DhfCcpNZfwGe4-h' },
  // Si hay carpetas, podemos enlazarlas directamente a la carpeta de Drive usando "folders/{id}"
  { nombre: 'Carpeta - Recursos', id: '1ekHg6goS20X0cQjqifb_Rc3QrtrZKxHM', isFolder: true },
];

export default function DocumentosPage() {
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewIsFolder, setPreviewIsFolder] = useState(false);

  const openPreview = (id: string, isFolder = false) => {
    setPreviewId(id);
    setPreviewIsFolder(isFolder);
  };

  const closePreview = () => {
    setPreviewId(null);
    setPreviewIsFolder(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Repositorio de Documentos</h1>
            <p className="text-gray-600">Accede y previsualiza recursos educativos almacenados en Google Drive.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Button variant="outline">Volver al inicio</Button>
            </Link>
            <a href="https://drive.google.com/drive/folders/1ekHg6goS20X0cQjqifb_Rc3QrtrZKxHM" target="_blank" rel="noreferrer">
              <Button variant="munay">Abrir carpeta en Drive</Button>
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {archivos.map((a) => (
            <Card key={a.id} className="border-2 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-munay-blue">{a.nombre}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {a.isFolder ? 'Carpeta de Drive' : 'Documento (vista previa disponible)'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">ID: {a.id}</div>
                  <div className="flex items-center space-x-2">
                    {a.isFolder ? (
                      <a href={`https://drive.google.com/drive/folders/${a.id}`} target="_blank" rel="noreferrer">
                        <Button variant="outline">Abrir carpeta</Button>
                      </a>
                    ) : (
                      <Button variant="munay" onClick={() => openPreview(a.id)}>
                        Ver documento
                      </Button>
                    )}
                    <a href={a.isFolder ? `https://drive.google.com/drive/folders/${a.id}` : `https://drive.google.com/file/d/${a.id}/view`} target="_blank" rel="noreferrer">
                      <Button variant="outline">Abrir en Drive</Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Preview Dialog */}
        <Dialog open={!!previewId} onOpenChange={(open) => { if (!open) closePreview(); }}>
          <DialogContent className="max-w-4xl w-full">
            <DialogHeader>
              <DialogTitle>Previsualización</DialogTitle>
              <DialogDescription>
                Vista previa del recurso. Si el archivo no permite previsualización en Drive, se abrirá en una nueva pestaña.
              </DialogDescription>
            </DialogHeader>

            <div className="h-[70vh]">
              {previewId && !previewIsFolder ? (
                // Usamos el visualizador embebido de Google Drive
                <iframe
                  title="drive-preview"
                  src={`https://drive.google.com/file/d/${previewId}/preview`}
                  className="w-full h-full border rounded-md"
                />
              ) : previewId && previewIsFolder ? (
                <iframe
                  title="drive-folder"
                  src={`https://drive.google.com/drive/folders/${previewId}`}
                  className="w-full h-full border rounded-md"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">No hay archivo seleccionado</div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closePreview}>Cerrar</Button>
              {previewId && (
                <a href={previewIsFolder ? `https://drive.google.com/drive/folders/${previewId}` : `https://drive.google.com/file/d/${previewId}/view`} target="_blank" rel="noreferrer">
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
