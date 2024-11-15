import { useState, useEffect, useRef } from 'react';

import dynamic from 'next/dynamic';
const PdfViewer = dynamic(
  () => import('components/global/lightbox/PdfViewer'),
  {
    ssr: false,
  }
);

const PopupPDF = ({ isOpen, onClose, pdfUrl }) => {
  const popupRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (isMounted) {
      if (isOpen) {
        document.body.style.marginRight =
          window.innerWidth - document.body.offsetWidth + 'px';
        document.body.classList.add('no-scroll');
      } else {
        document.body.style.marginRight = '0';
        document.body.classList.remove('no-scroll');
      }
    }
  }, [isOpen, isMounted]);

  function getSafariVersion(): string | null {
    const userAgent = navigator.userAgent;
    const versionMatch = userAgent.match(/Version\/(\d+(\.\d+)?)/);
    return versionMatch ? versionMatch[1] : null;
  }

  const safariVersion = getSafariVersion();

  const isSupportedBrowser = !safariVersion || parseFloat(safariVersion) >= 16;

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      // console.error('Error downloading file:', error);
    }
  };

  return (
    <>
      {isOpen && pdfUrl && (
        <div
          ref={popupRef}
          className={`modal modal_pdf ${isOpen ? 'modal_active' : ''}`}
          onClick={onClose}
        >
          <div className="modal_content" onClick={(e) => e.stopPropagation()}>
            <div className="modal_nav">
              <button
                onClick={() => handleDownload(pdfUrl.url, pdfUrl.name)}
                className={`modal_download`}
              >
                <svg
                  fill="#000000"
                  height="28px"
                  width="28px"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 29.978 29.978"
                >
                  <g>
                    <path
                      d="M25.462,19.105v6.848H4.515v-6.848H0.489v8.861c0,1.111,0.9,2.012,2.016,2.012h24.967c1.115,0,2.016-0.9,2.016-2.012
                              v-8.861H25.462z"
                    />
                    <path
                      d="M14.62,18.426l-5.764-6.965c0,0-0.877-0.828,0.074-0.828s3.248,0,3.248,0s0-0.557,0-1.416c0-2.449,0-6.906,0-8.723
                              c0,0-0.129-0.494,0.615-0.494c0.75,0,4.035,0,4.572,0c0.536,0,0.524,0.416,0.524,0.416c0,1.762,0,6.373,0,8.742
                              c0,0.768,0,1.266,0,1.266s1.842,0,2.998,0c1.154,0,0.285,0.867,0.285,0.867s-4.904,6.51-5.588,7.193
                              C15.092,18.979,14.62,18.426,14.62,18.426z"
                    />
                  </g>
                </svg>
              </button>

              <button className={`modal_close`} onClick={onClose}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <g fill="currentColor">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      fill="#fff"
                      d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                    ></path>
                  </g>
                </svg>
              </button>
            </div>

            {isSupportedBrowser ? (
              <PdfViewer pdfUrl={pdfUrl.url} />
            ) : (
              <div style={{ overflow: 'scroll' }}>
                <embed src={pdfUrl.url} width="100%" height="100%" />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PopupPDF;
