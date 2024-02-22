import Image from 'next/image';

export default function NextJsImage(slide) {
  const data = slide.slide;

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <Image
        src={
          window.innerWidth < 768
            ? data.formats?.small?.url
            : data.formats?.xlarge?.url || data.url
        }
        alt={data.alternativeText || 'Alpine Armoring'}
        width={data.width}
        height={data.height}
        style={{
          height: 'auto',
          width: 'auto',
          margin: '0 auto',
          objectFit: 'contain',
        }}
        priority
      ></Image>
    </div>
  );
}
