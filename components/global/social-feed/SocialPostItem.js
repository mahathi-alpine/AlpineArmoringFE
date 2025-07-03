// components/SocialFeed/SocialPostItem.js
import { useState, useRef, useEffect } from 'react';
import styles from './SocialPostItem.module.scss';
// import { PlayIcon } from './PlayIcon';

const SocialPostItem = ({ post }) => {
  const [isInView, setIsInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef(null);

  const isVideo = ['reel', 'youtube_short', 'youtube_video', 'tiktok'].includes(
    post.type
  );

  console.log('🏗️ SocialPostItem render:', {
    platform: post.platform,
    type: post.type,
    postId: post.postId,
    isVideo,
    isPlaying,
  });

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // const handlePlayClick = () => {
  //   console.log('🎬 Play button clicked!');
  //   setIsPlaying(true);

  //   // Find and click the actual video/iframe to trigger playback
  //   setTimeout(() => {
  //     const container = containerRef.current;
  //     if (container) {
  //       // Try to find and click the iframe or video element
  //       const iframe = container.querySelector('iframe');
  //       const video = container.querySelector('video');

  //       if (iframe) {
  //         console.log('📺 Clicking iframe to start playback');
  //         // Create a click event on the iframe
  //         const clickEvent = new MouseEvent('click', {
  //           view: window,
  //           bubbles: true,
  //           cancelable: true,
  //         });
  //         iframe.dispatchEvent(clickEvent);

  //         // Also try to focus the iframe which can sometimes trigger autoplay
  //         iframe.focus();
  //       } else if (video) {
  //         console.log('▶️ Playing video element directly');
  //         video.play().catch((e) => console.log('Video play failed:', e));
  //       } else {
  //         console.log('❌ No playable element found');
  //       }
  //     }
  //   }, 100);
  // };

  const getPlatformIcon = () => {
    const icons = {
      instagram: '📷',
      youtube: '▶️',
      tiktok: '🎵',
    };
    return icons[post.platform] || '📱';
  };
  return (
    <div ref={containerRef} className={styles.socialPost}>
      <div className={styles.socialPost_container}>
        {/* All video platforms get embedded immediately */}
        {isVideo ? (
          <div
            className={`${styles.socialPost_player} ${styles[`socialPost_player_${post.platform}`]}`}
            style={{ minHeight: '555px', position: 'relative' }}
          >
            {isInView ? (
              <>
                {post.platform === 'instagram' && (
                  <InstagramEmbed
                    postId={post.postId}
                    onPlay={() => setIsPlaying(true)}
                  />
                )}
                {post.platform === 'youtube' && (
                  <YouTubeEmbed
                    postId={post.postId}
                    onPlay={() => setIsPlaying(true)}
                  />
                )}
                {post.platform === 'tiktok' && (
                  <TikTokEmbed
                    postId={post.postId}
                    onPlay={() => setIsPlaying(true)}
                  />
                )}

                {/* {!isPlaying && (
                  <div 
                    className={styles.socialPost_videoPlayOverlay}
                    onClick={handlePlayClick}
                  >
                    <PlayIcon className={styles.socialPost_playIcon} />
                  </div>
                )} */}
              </>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '555px',
                  background: '#f0f0f0',
                  color: '#666',
                }}
              >
                Loading {post.platform} content...
              </div>
            )}

            {/* Platform indicator */}
            <div className={styles.socialPost_platform}>
              <span className={styles.socialPost_platformIcon}>
                {getPlatformIcon()}
              </span>
            </div>
          </div>
        ) : (
          /* Non-video posts (regular Instagram posts) use thumbnail */
          <div className={styles.socialPost_thumbnail}>
            {isInView && (
              <img
                src={post.thumbnail}
                alt={post.caption || `${post.platform} post`}
                className={styles.socialPost_image}
                loading="lazy"
              />
            )}

            <div className={styles.socialPost_platform}>
              <span className={styles.socialPost_platformIcon}>
                {getPlatformIcon()}
              </span>
            </div>
          </div>
        )}

        <div className={styles.socialPost_info}>
          <div className={styles.socialPost_stats}>
            {post.likes && (
              <span className={styles.socialPost_stat}>❤️ {post.likes}</span>
            )}
            {post.views && (
              <span className={styles.socialPost_stat}>👁️ {post.views}</span>
            )}
            {post.comments && (
              <span className={styles.socialPost_stat}>💬 {post.comments}</span>
            )}
          </div>

          {/* {post.caption && (
            <p className={styles.socialPost_caption}>
              {post.caption.length > 60 
                ? `${post.caption.substring(0, 60)}...` 
                : post.caption
              }
            </p>
          )} */}
        </div>
      </div>
    </div>
  );
};

// Instagram embed component with looping
const InstagramEmbed = ({ postId, onPlay }) => {
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const [embedError, setEmbedError] = useState(false);
  const iframeRef = useRef(null);

  // Updated embed URL with autoplay and loop parameters
  const embedUrl = `https://www.instagram.com/p/${postId}/embed/?cr=1&v=14&wp=540&autoplay=1&loop=1`;

  const handleIframeLoad = () => {
    console.log('✅ Instagram embed loaded successfully');
    setEmbedLoaded(true);
  };

  const handleIframeError = () => {
    console.log('❌ Instagram embed failed to load');
    setEmbedError(true);
  };

  const handleClick = () => {
    console.log('🎬 Instagram embed clicked');
    onPlay();
  };

  if (embedError) {
    return <EmbedFallback platform="Instagram" postId={postId} />;
  }

  return (
    <iframe
      ref={iframeRef}
      src={embedUrl}
      width="100%"
      height="555"
      frameBorder="0"
      scrolling="no"
      allowTransparency="true"
      allow="autoplay; encrypted-media; fullscreen"
      allowFullScreen
      onLoad={handleIframeLoad}
      onError={handleIframeError}
      onClick={handleClick}
      style={{
        border: 'none',
        overflow: 'hidden',
        minHeight: '575px',
        opacity: embedLoaded ? 1 : 0.7,
        transition: 'opacity 0.3s ease',
        cursor: 'pointer',
      }}
    />
  );
};

// YouTube embed component with looping
const YouTubeEmbed = ({ postId, onPlay }) => {
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const [embedError, setEmbedError] = useState(false);
  const iframeRef = useRef(null);

  // YouTube embed URL with autoplay enabled and loop
  const embedUrl = `https://www.youtube.com/embed/${postId}?autoplay=1&loop=1&playlist=${postId}&controls=1&modestbranding=1&rel=0&showinfo=0`;

  const handleIframeLoad = () => {
    console.log('✅ YouTube embed loaded successfully');
    setEmbedLoaded(true);
  };

  const handleIframeError = () => {
    console.log('❌ YouTube embed failed to load');
    setEmbedError(true);
  };

  const handleClick = () => {
    console.log('🎬 YouTube embed clicked');
    onPlay();
  };

  if (embedError) {
    return <EmbedFallback platform="YouTube" postId={postId} />;
  }

  return (
    <iframe
      ref={iframeRef}
      src={embedUrl}
      width="100%"
      height="200"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      onLoad={handleIframeLoad}
      onError={handleIframeError}
      onClick={handleClick}
      style={{
        border: 'none',
        minHeight: '455px',
        opacity: embedLoaded ? 1 : 0.7,
        transition: 'opacity 0.3s ease',
        cursor: 'pointer',
      }}
    />
  );
};

// TikTok embed component
const TikTokEmbed = ({ postId }) => {
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const [embedError, setEmbedError] = useState(false);

  useEffect(() => {
    // Load TikTok embed script if not already loaded
    if (!document.querySelector('script[src*="tiktok.com/embed.js"]')) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.tiktok.com/embed.js';
      document.body.appendChild(script);
    }
  }, []);

  const handleIframeLoad = () => {
    console.log('✅ TikTok embed loaded successfully');
    setEmbedLoaded(true);
  };

  const handleIframeError = () => {
    console.log('❌ TikTok embed failed to load');
    setEmbedError(true);
  };

  if (embedError) {
    return <EmbedFallback platform="TikTok" postId={postId} />;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '655px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <blockquote
        className="tiktok-embed"
        cite={`https://www.tiktok.com/@user/video/${postId}`}
        data-video-id={postId}
        style={{
          maxWidth: '100%',
          minWidth: '100%',
          margin: 0,
          opacity: embedLoaded ? 1 : 0.7,
          transition: 'opacity 0.3s ease',
        }}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      >
        <section>
          <a
            target="_blank"
            title={`@user - TikTok ${postId}`}
            href={`https://www.tiktok.com/@user/video/${postId}`}
            rel="noopener noreferrer"
          >
            View on TikTok
          </a>
        </section>
      </blockquote>
    </div>
  );
};

// Reusable fallback component
const EmbedFallback = ({ platform, postId }) => {
  const platformColors = {
    Instagram:
      'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
    YouTube: '#FF0000',
    TikTok: '#000000',
  };

  const platformUrls = {
    Instagram: `https://www.instagram.com/p/${postId}/`,
    YouTube: `https://www.youtube.com/watch?v=${postId}`,
    TikTok: `https://www.tiktok.com/@user/video/${postId}`,
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '655px',
        background: platformColors[platform],
        flexDirection: 'column',
        color: 'white',
        textAlign: 'center',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '15px',
          borderRadius: '10px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
          {platform} Video
        </p>
        <p style={{ margin: '0 0 15px 0', fontSize: '12px', opacity: 0.9 }}>
          ID: {postId}
        </p>
        <a
          href={platformUrls[platform]}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: 'white',
            color: platformColors[platform],
            padding: '8px 16px',
            textDecoration: 'none',
            borderRadius: '20px',
            fontWeight: 'bold',
            display: 'inline-block',
          }}
        >
          View on {platform}
        </a>
      </div>
    </div>
  );
};

export default SocialPostItem;
