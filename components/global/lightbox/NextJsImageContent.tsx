import Image from 'next/image';

export default function NextJsImage({ slide }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {slide.src && (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Image
            src={
              window.innerWidth < 500
                ? slide.formats?.thumbnail?.url || slide.src
                : window.innerWidth >= 500 && window.innerWidth < 1280
                  ? slide.formats?.large?.url ||
                    slide.formats?.medium?.url ||
                    slide.src
                  : slide.formats?.xlarge?.url || slide.src
            }
            alt={slide.alt || 'Alpine Armoring'}
            width={
              window.innerWidth < 500
                ? slide.formats?.thumbnail?.width || slide.width
                : window.innerWidth >= 500 && window.innerWidth < 1280
                  ? slide.formats?.large?.width ||
                    slide.formats?.medium?.width ||
                    slide.width
                  : slide.formats?.xlarge?.width || slide.width
            }
            height={
              window.innerWidth < 500
                ? slide.formats?.thumbnail?.height || slide.height
                : window.innerWidth >= 500 && window.innerWidth < 1280
                  ? slide.formats?.large?.height ||
                    slide.formats?.medium?.height ||
                    slide.height
                  : slide.formats?.xlarge?.height || slide.height
            }
            style={{
              height: 'auto',
              width: '100%',
              objectFit: 'contain',
            }}
            priority={slide.index === slide.selectedIndex}
          />

          {/* Overlay with alt text and caption */}
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
            }}
          >
            {slide.alt && (
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.5)',
                  color: '#fff',
                  padding: '10px',
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                }}
              >
                {slide.alt}
              </div>
            )}
            {slide.caption && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.5)',
                  color: '#fff',
                  padding: '10px',
                  textAlign: 'center',
                  fontSize: '1rem',
                }}
              >
                {slide.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
