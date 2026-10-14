import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const mdPath = path.resolve('DEVELOPMENT_SETUP.md');
const htmlTempPath = path.resolve('scratch/DEVELOPMENT_SETUP_styled.html');
const pdfOutputPath = path.resolve('DEVELOPMENT_SETUP.pdf');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const css = `
<style>
  @page {
    size: A4;
    margin: 20mm 18mm 20mm 18mm;
    @bottom-right {
      content: counter(page);
    }
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #24292f;
    line-height: 1.6;
    font-size: 13.5px;
  }
  h1, h2, h3, h4 {
    color: #092C4C;
    font-weight: 700;
  }
  h1 {
    font-size: 26px;
    border-bottom: 2px solid #092C4C;
    padding-bottom: 8px;
    margin-top: 0;
  }
  h2 {
    font-size: 20px;
    border-bottom: 1px solid #d0d7de;
    padding-bottom: 6px;
    margin-top: 24px;
    page-break-after: avoid;
  }
  h3 {
    font-size: 16px;
    margin-top: 18px;
    page-break-after: avoid;
  }
  p, ul, ol {
    margin-bottom: 12px;
  }
  code {
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
    font-size: 12px;
    background-color: #f6f8fa;
    padding: 2px 5px;
    border-radius: 4px;
    border: 1px solid #e1e4e8;
  }
  pre {
    background-color: #0d1117;
    color: #e6edf3;
    padding: 12px 14px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 12px;
    line-height: 1.45;
    page-break-inside: avoid;
  }
  pre code {
    background-color: transparent;
    color: inherit;
    padding: 0;
    border: none;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    font-size: 12px;
    page-break-inside: auto;
  }
  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
  th, td {
    border: 1px solid #d0d7de;
    padding: 7px 10px;
    text-align: left;
  }
  th {
    background-color: #f6f8fa;
    font-weight: 600;
    color: #1f2328;
  }
  tr:nth-child(even) td {
    background-color: #fafbfc;
  }
  blockquote {
    border-left: 4px solid #0969da;
    background-color: #ddf4ff;
    padding: 10px 14px;
    margin: 14px 0;
    border-radius: 0 6px 6px 0;
    color: #092C4C;
  }
  blockquote p {
    margin: 0;
  }
  hr {
    border: 0;
    border-top: 1px solid #d0d7de;
    margin: 20px 0;
  }
  .task-list-item {
    list-style-type: none;
  }
</style>
`;

// 1. Usar pandoc para compilar el HTML base
execSync(`pandoc -s --toc "${mdPath}" -o "${htmlTempPath}"`, { stdio: 'inherit' });

// 2. Inyectar el CSS personalizado en el head
let htmlContent = fs.readFileSync(htmlTempPath, 'utf8');
htmlContent = htmlContent.replace('</head>', `${css}</head>`);
fs.writeFileSync(htmlTempPath, htmlContent, 'utf8');

// 3. Ejecutar Edge headless para imprimir a PDF
console.log('Imprimiendo a PDF con Microsoft Edge...');
const edgeCmd = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfOutputPath}" --no-pdf-header-footer "file:///${htmlTempPath.replace(/\\\\/g, '/')}"`;
execSync(edgeCmd, { stdio: 'inherit' });

console.log('PDF generado exitosamente en:', pdfOutputPath);
