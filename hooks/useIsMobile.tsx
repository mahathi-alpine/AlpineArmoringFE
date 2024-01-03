import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMobile(window.innerWidth <= 768);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateMedia = () => {
        setMobile(window.innerWidth <= 768);
      };

      window.addEventListener('resize', updateMedia);
      return () => window.removeEventListener('resize', updateMedia);
    }
  }, []);

  return isMobile;
}

// USAGE //
// import { useIsMobile } from 'hooks/useIsMobile';
// const isMobile = useIsMobile();
