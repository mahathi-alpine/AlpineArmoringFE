import Image from 'next/image';

export default function NextJsImage({ slide }) {
  return (
    <>
      {slide.src ? (
        <div style={{ display: 'flex', height: '100%' }}>
          <Image
            src={
              window.innerWidth < 500
                ? slide.formats?.thumbnail?.url
                : window.innerWidth >= 500 && window.innerWidth < 1280
                  ? slide.formats?.large?.url
                  : slide.formats?.xlarge?.url || slide.src
            }
            alt={slide.alt || 'Alpine Armoring'}
            width={
              window.innerWidth < 500
                ? slide.formats?.thumbnail?.width
                : window.innerWidth >= 500 && window.innerWidth < 1280
                  ? slide.formats?.large?.width
                  : slide.formats?.xlarge?.width || slide.width
            }
            height={
              window.innerWidth < 500
                ? slide.formats?.thumbnail?.height
                : window.innerWidth >= 500 && window.innerWidth < 1280
                  ? slide.formats?.large?.height
                  : slide.formats?.xlarge?.height || slide.height
            }
            style={{
              height: 'auto',
              width: 'auto',
              margin: '0 auto',
              objectFit: 'contain',
            }}
            priority={slide.index == slide.selectedIndex}
          ></Image>
        </div>
      ) : null}
    </>
  );
}
