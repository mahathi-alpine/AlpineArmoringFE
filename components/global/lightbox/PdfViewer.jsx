import { Viewer, Worker } from '@react-pdf-viewer/core';
// import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
// import '@react-pdf-viewer/core/lib/styles/index.css';
// import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PdfViewer = ({ pdfUrl }) => {
  // const defaultLayoutPluginInstance = defaultLayoutPlugin;
  // const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      {/* <div style={{ height: '100vh', width: '100%' }}> */}
        <Viewer
          fileUrl={pdfUrl}
          defaultScale={1.2}
          // defaultLayout={defaultLayoutPluginInstance}
          // plugins={[defaultLayoutPluginInstance]}Instance]}
        />
      {/* </div> */}
    </Worker>
  );
};

export default PdfViewer;
