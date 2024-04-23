import Image from 'next/image';

export default function NextJsImage({ slide }) {
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <Image
        src={
          window.innerWidth < 768
            ? slide.formats?.thumbnail?.url
            : slide.formats?.xlarge?.url || slide.src
        }
        alt={slide.alt || 'Alpine Armoring'}
        width={slide.width}
        height={slide.height}
        style={{
          height: 'auto',
          width: 'auto',
          margin: '0 auto',
          objectFit: 'contain',
        }}
        priority={slide.index == slide.selectedIndex}
      ></Image>
    </div>
  );
}
