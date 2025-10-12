import { useState, useCallback, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import Link from 'next/link';

export default function CustomMarkdown({ children }) {
  const [hoveredImage, setHoveredImage] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const checkIntervalRef = useRef(null);

  // Detect if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const openPopupWindow = useCallback((url) => {
    const width = Math.min(1500, window.innerWidth * 0.8);
    const height = Math.min(1000, window.innerHeight * 0.8);

    const left = (window.innerWidth - width) / 2 + window.screenX;
    const top = (window.innerHeight - height) / 2 + window.screenY;

    window.open(
      url,
      `popup_${Date.now()}`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,status=yes,location=yes`
    );
  }, []);

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const checkHoverState = useCallback(() => {
    const triggers = document.querySelectorAll(
      '.markdownImageHoverPopup_trigger:hover'
    );
    if (triggers.length === 0) {
      setHoveredImage(null);
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    }
  }, []);

  const handleMouseEnter = useCallback(
    (imageUrl, e) => {
      if (isMobile) return; // Skip hover on mobile

      setHoveredImage(imageUrl);
      handleMouseMove(e);

      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      checkIntervalRef.current = setInterval(checkHoverState, 100);
    },
    [checkHoverState, isMobile]
  );

  const handleClick = useCallback(
    (imageUrl, e) => {
      if (!isMobile) return; // Only handle clicks on mobile

      e.preventDefault();
      e.stopPropagation();

      if (hoveredImage === imageUrl) {
        // If same image is clicked, hide it
        setHoveredImage(null);
      } else {
        // Show the clicked image
        setHoveredImage(imageUrl);
        handleMouseMove(e);
      }
    },
    [isMobile, hoveredImage]
  );

  // Close image on outside click (mobile)
  useEffect(() => {
    if (!isMobile || !hoveredImage) return;

    const handleOutsideClick = (e) => {
      if (
        !e.target.closest('.markdownImageHoverPopup_trigger') &&
        !e.target.closest('.markdownImageHoverPopup')
      ) {
        setHoveredImage(null);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isMobile, hoveredImage]);

  useEffect(() => {
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  const components = {
    a: ({ href, children, ...props }) => {
      const isExternal =
        href &&
        (href.startsWith('http') ||
          href.startsWith('www') ||
          href.startsWith('//'));

      const isImageLink = href && href.match(/\.(jpg|jpeg|png|gif|webp)$/i);

      if (isImageLink) {
        return (
          <span
            className="markdownImageHoverPopup_trigger"
            onMouseEnter={(e) => handleMouseEnter(href, e)}
            onMouseMove={handleMouseMove}
            onClick={(e) => handleClick(href, e)}
            style={{ cursor: isMobile ? 'pointer' : 'help' }}
          >
            {children}
            <svg
              className="markdownImageHoverPopup_icon"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              height="100%"
              width="100%"
              preserveAspectRatio="xMidYMid meet"
              focusable="false"
            >
              <path
                fill="white"
                data-name="Pfad 7209"
                d="M14.8 9.65h2.63v2.63H14.8Zm0 5.25h2.63v7.86H14.8Z"
              ></path>
            </svg>
          </span>
        );
      }

      if (isExternal) {
        return (
          <a
            href={href}
            onClick={(e) => {
              e.preventDefault();
              openPopupWindow(
                href,
                typeof children[0] === 'string'
                  ? children[0]
                  : 'External Content'
              );
            }}
            className="external-link"
            data-external="true"
            rel="nofollow noopener noreferrer"
            aria-label={`${typeof children[0] === 'string' ? children[0] : 'Link'} (opens in popup window)`}
            {...props}
          >
            {children}
          </a>
        );
      }

      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    },
  };

  if (!children) return null;

  return (
    <>
      {hoveredImage && (
        <span
          className="markdownImageHoverPopup"
          style={{
            left: isMobile ? '20%' : mousePosition.x + 10,
            top: isMobile ? '50%' : mousePosition.y - 100,
          }}
        >
          <Image
            src={hoveredImage}
            alt="Alpine Armoring"
            width={isMobile ? 350 : 700}
            height={isMobile ? 350 : 700}
          />
          {isMobile && <button onClick={() => setHoveredImage(null)}>×</button>}
        </span>
      )}

      <ReactMarkdown
        rehypePlugins={[rehypeRaw, remarkGfm]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </>
  );
}
