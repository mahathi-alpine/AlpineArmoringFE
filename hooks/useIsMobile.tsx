import { useState, useEffect, useRef } from 'react';

export function useIsMobile() {
  const [isMobile, setMobile] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setMobile(window.innerWidth <= 768);
    };

    if (!initialized.current) {
      checkScreenSize();
      initialized.current = true;
    }

    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return isMobile;
}

// USAGE //
// import { useIsMobile } from 'hooks/useIsMobile';
// const isMobile = useIsMobile();
