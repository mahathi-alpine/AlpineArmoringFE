import { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function NextJsImage({ slide }) {
  const pdfContainerRef = useRef(null);

  useEffect(() => {
    if (slide.src) {
      const loadPDF = async () => {
        try {
          console.log('Loading PDF from URL:', slide.src);
          const loadingTask = pdfjsLib.getDocument(slide.src);
          const pdf = await loadingTask.promise;
          const page = await pdf.getPage(1);
          const scale = 1.5;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport,
          };

          await page.render(renderContext).promise;

          if (pdfContainerRef.current) {
            pdfContainerRef.current.appendChild(canvas);
          }
        } catch (error) {
          console.error('Error loading PDF:', error);
        }
      };

      loadPDF();
    }
  }, [slide.src]);

  return (
    <>
      {slide.src ? (
        <object
          data={slide.src}
          type="application/pdf"
          style={{
            width: 830,
            height: `100vH`,
            maxWidth: '100%',
          }}
        >
          <embed
            src={slide.src}
            type="application/pdf"
            style={{
              width: 830,
              height: `100vH`,
              maxWidth: '100%',
            }}
          />
          <div
            ref={pdfContainerRef}
            style={{ width: 830, height: '100vH', maxWidth: '100%' }}
          >
            {/* Fallback content will be rendered here */}
          </div>
        </object>
      ) : null}
    </>
  );
}
