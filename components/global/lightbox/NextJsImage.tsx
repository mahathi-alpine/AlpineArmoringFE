import { CldImage } from 'next-cloudinary';

export default function NextJsImage(slide) {
  // console.log(slide)
  const data = slide.slide;

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <CldImage
        src={
          window.innerWidth < 768
            ? data.formats?.small?.url
            : data.formats?.xlarge?.url || data.url
        }
        alt={data.alt || 'Alpine Armoring'}
        width={data.width}
        height={data.height}
        style={{
          height: 'auto',
          width: 'auto',
          margin: 'auto',
          objectFit: 'contain',
        }}
        priority
      ></CldImage>
    </div>
  );
}
