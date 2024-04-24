// import Image, { StaticImageData } from 'next/image';
import Image from 'next/image';
import {} from // RenderSlideProps,
// isImageSlide,
// Slide,
'yet-another-react-lightbox';

// function isNextJsImage(slide: Slide): slide is StaticImageData {
//   return (
//     isImageSlide(slide) &&
//     typeof slide.width === 'number' &&
//     typeof slide.height === 'number'
//   );
// }

// export default function NextJsImage({
//   slide,
// }: Pick<RenderSlideProps, 'slide' | 'rect'>) {
//   if (!isNextJsImage(slide)) return undefined;

export default function NextJsImage(slide) {
  return (
    <>
      {slide.slide.src ? (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Image
            alt={slide.slide.alt || 'Alpine Armoring'}
            src={slide.slide.formats?.thumbnail.url || slide.slide.url}
            loading="eager"
            draggable={false}
            placeholder={slide.slide.blurDataURL ? 'blur' : undefined}
            style={{ objectFit: 'cover', height: '100%' }}
            width={122}
            height={82}
          />
        </div>
      ) : null}
    </>
  );
}
