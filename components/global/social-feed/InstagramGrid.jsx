import { useState, useEffect } from 'react';
import Script from 'next/script';
import InstagramEmbed from './InstagramEmbed';

function InstagramGrid ({ posts = [] }) {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const handleScriptLoad = () => {
    setScriptLoaded(true);
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  };

  useEffect(() => {
    // Re-process embeds when posts change and script is loaded
    if (scriptLoaded && window.instgrm) {
      const timer = setTimeout(() => {
        window.instgrm.Embeds.process();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [posts, scriptLoaded]);

  return (
    <div className="instagram-grid">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
        padding: '20px',
      }}>
        {posts.map((post, index) => (
          <InstagramEmbed
            key={`${post.url}-${index}`}
            url={post.url}
            width={540}
            hideCaption={false}
          />
        ))}
      </div>
      
      <Script
        src="//www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
      />
    </div>
  );
};

export default InstagramGrid;