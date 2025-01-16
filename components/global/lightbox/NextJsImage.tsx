import Image from 'next/image';

export default function NextJsImage({ slide }) {
  return (
    <>
      {slide.src ? (
        <div style={{ display: 'flex', height: '100%' }}>
          <Image
            src={
              window.innerWidth < 500
                ? slide.formats?.medium?.url || slide.src
                : window.innerWidth >= 500 && window.innerWidth < 1280
                  ? slide.formats?.large?.url ||
                    slide.formats?.medium?.url ||
                    slide.src
                  : slide.formats?.xlarge?.url || slide.src
            }
            alt={slide.alt || 'Alpine Armoring'}
            width={
              window.innerWidth < 500
                ? slide.formats?.medium?.width || slide.width
                : window.innerWidth >= 500 && window.innerWidth < 1280
                  ? slide.formats?.large?.width ||
                    slide.formats?.medium?.width ||
                    slide.width
                  : slide.formats?.xlarge?.width || slide.width
            }
            height={
              window.innerWidth < 500
                ? slide.formats?.medium?.height || slide.height
                : window.innerWidth >= 500 && window.innerWidth < 1280
                  ? slide.formats?.large?.height ||
                    slide.formats?.medium?.height ||
                    slide.height
                  : slide.formats?.xlarge?.height || slide.height
            }
            style={{
              height: 'auto',
              // width: 'auto',
              margin: '0 auto',
              objectFit: 'contain',
            }}
            priority={slide.index == slide.selectedIndex}
            unoptimized={slide.unoptimized == true}
          ></Image>
        </div>
      ) : null}
    </>
  );
}
