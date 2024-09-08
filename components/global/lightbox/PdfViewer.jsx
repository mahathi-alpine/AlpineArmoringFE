import { Viewer, Worker } from '@react-pdf-viewer/core';

const PdfViewer = ({ pdfUrl }) => {
  function getSafariVersion() {
    const userAgent = navigator.userAgent;
    const versionMatch = userAgent.match(/Version\/(\d+(\.\d+)?)/);
    if (versionMatch) {
      return versionMatch[1];
    }
    return null;
  }

  const safariVersion = getSafariVersion();
  const isSupportedBrowser = !safariVersion || safariVersion >= 16;

  return (
    <>
      {isSupportedBrowser ? (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer fileUrl={pdfUrl} defaultScale={1.2} />
        </Worker>
      ) : (
        <embed src={pdfUrl} width="100%" height="100%" />
        // <object data={pdfUrl} type="application/pdf" width="100%" height="100%">
        //   <a href={pdfUrl}>test.pdf</a>
        // </object>
      )}
    </>
  );
};

export default PdfViewer;
