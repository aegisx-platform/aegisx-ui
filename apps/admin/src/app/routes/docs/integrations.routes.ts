import { Route } from '@angular/router';

export const INTEGRATIONS_ROUTES: Route[] = [
  {
    path: 'overview',
    loadComponent: () =>
      import(
        '../../pages/docs/integrations/overview/integrations-overview.component'
      ).then((m) => m.IntegrationsOverviewComponent),
    data: {
      title: 'Integrations Overview',
      description: 'Third-party integrations overview',
    },
  },
  {
    path: 'gridster',
    loadComponent: () =>
      import(
        '../../pages/docs/integrations/gridster/gridster-doc.component'
      ).then((m) => m.GridsterDocComponent),
    data: {
      title: 'Gridster',
      description: 'Gridster layout integration',
    },
  },
  {
    path: 'qrcode',
    loadComponent: () =>
      import('../../pages/docs/integrations/qrcode/qrcode-doc.component').then(
        (m) => m.QRCodeDocComponent,
      ),
    data: {
      title: 'QR Code',
      description: 'QR code generation integration',
    },
  },
  {
    path: 'signature-pad',
    loadComponent: () =>
      import(
        '../../pages/docs/integrations/signature-pad/signature-pad-doc.component'
      ).then((m) => m.SignaturePadDocComponent),
    data: {
      title: 'Signature Pad',
      description: 'Digital signature integration',
    },
  },
  {
    path: 'ngx-charts',
    loadComponent: () =>
      import(
        '../../pages/docs/integrations/ngx-charts/ngx-charts-doc.component'
      ).then((m) => m.NgxChartsDocComponent),
    data: {
      title: 'NGX Charts',
      description: 'NGX charts integration',
    },
  },
  {
    path: 'chartjs',
    loadComponent: () =>
      import(
        '../../pages/docs/integrations/chartjs/chartjs-doc.component'
      ).then((m) => m.ChartjsDocComponent),
    data: {
      title: 'Chart.js',
      description: 'Chart.js integration',
    },
  },
  {
    path: 'pdf-viewer',
    loadComponent: () =>
      import(
        '../../pages/docs/integrations/pdf-viewer/pdf-viewer-doc.component'
      ).then((m) => m.PdfViewerDocComponent),
    data: {
      title: 'PDF Viewer',
      description: 'PDF viewer integration',
    },
  },
  {
    path: 'image-cropper',
    loadComponent: () =>
      import(
        '../../pages/docs/integrations/image-cropper/image-cropper-doc.component'
      ).then((m) => m.ImageCropperDocComponent),
    data: {
      title: 'Image Cropper',
      description: 'Image cropper integration',
    },
  },
  {
    path: 'monaco-editor',
    loadComponent: () =>
      import(
        '../../pages/docs/integrations/monaco-editor/monaco-editor-doc.component'
      ).then((m) => m.MonacoEditorDocComponent),
    data: {
      title: 'Monaco Editor',
      description: 'Monaco editor integration',
    },
  },
];
