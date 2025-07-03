import { useEffect, useRef } from 'react';
import Script from 'next/script';

const InstagramEmbed = ({ url, width = 540, hideCaption = false }) => {
  const embedRef = useRef(null);

  useEffect(() => {
    // Process embeds when component mounts or updates
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, [url]);

  return (
    <>
      <blockquote
        ref={embedRef}
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        data-instgrm-captioned={!hideCaption}
        style={{
          background: '#FFF',
          border: 0,
          borderRadius: '3px',
          boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
          margin: '1px',
          maxWidth: `${width}px`,
          minWidth: '326px',
          padding: 0,
          width: '99.375%',
          width: '-webkit-calc(100% - 2px)',
          width: 'calc(100% - 2px)',
        }}
      ></blockquote>

      <Script
        src="//www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (window.instgrm) {
            window.instgrm.Embeds.process();
          }
        }}
      />
    </>
  );
};

export default InstagramEmbed;
