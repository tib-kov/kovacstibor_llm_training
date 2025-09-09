import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'products',
    renderMode: RenderMode.Server  // Changed from Prerender to Server for dynamic data
  },
  {
    path: 'products/create',
    renderMode: RenderMode.Server  // Changed from Prerender to Server
  },
  {
    path: 'products/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'products/:id/edit',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
