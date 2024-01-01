import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    setMobile(window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    const updateMedia = () => {
      setMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

  return isMobile;
}

// USAGE //
// import { useIsMobile } from '../hooks/useIsMobile';
// const isMobile = useIsMobile();
