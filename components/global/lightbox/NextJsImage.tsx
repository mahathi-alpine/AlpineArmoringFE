import { CldImage } from 'next-cloudinary';

export default function NextJsImage(slide) {
  const data = slide.slide;

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <CldImage
        src={
          window.innerWidth < 768
            ? data.formats?.small?.src
            : data.formats?.xlarge?.src || data.src
        }
        alt={data.alt || 'Alpine Armoring'}
        width={data.width}
        height={data.height}
        style={{
          height: 'auto',
          width: 'auto',
          margin: '0 auto',
          objectFit: 'contain',
        }}
        priority
      ></CldImage>
    </div>
  );
}
