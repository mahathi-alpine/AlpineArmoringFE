import React, { useState, useEffect, useRef } from 'react';

export default function NextJsImage({ slide }) {
  const [pdfSrc, setPdfSrc] = useState('');
  const iframeRef = useRef(null);

  useEffect(() => {
    setPdfSrc(`${slide.src}`);
  }, []);

  useEffect(() => {
    if (iframeRef.current && pdfSrc) {
      iframeRef.current.src = pdfSrc;
    }
  }, [pdfSrc]);

  return (
    <>
      {slide.src ? (
        <iframe ref={iframeRef} style={{ width: `100%`, height: `100vH` }}>
          <p>It appears your web browser doesn&apos;t support iframes.</p>
        </iframe>
      ) : // <object
      //   data={`https://drive.google.com/file/d/${slide.src}/preview?usp=sharing`}
      //   type="application/pdf"
      //   style={{
      //     // width: `${slide.width}px`,
      //     // height: `${slide.height}px`,
      //     width: 830,
      //     height: `100vH`,
      //     maxWidth: '100%',
      //   }}
      // >
      //   <embed
      //     src={`https://drive.google.com/file/d/${slide.src}/preview?usp=sharing`}
      //     style={{
      //       width: 830,
      //       height: `100vH`,
      //       maxWidth: '100%',
      //     }}
      //   />
      // </object>
      null}
    </>
  );
}
