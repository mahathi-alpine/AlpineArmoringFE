import { Viewer, Worker } from '@react-pdf-viewer/core';

const PdfViewer = ({ pdfUrl }) => {
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <Viewer fileUrl={pdfUrl} defaultScale={1.2} />
    </Worker>
  );
};

export default PdfViewer;
