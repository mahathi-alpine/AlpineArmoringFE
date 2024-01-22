import Image, { StaticImageData } from 'next/image';
import {
  RenderSlideProps,
  isImageSlide,
  Slide,
} from 'yet-another-react-lightbox';

function isNextJsImage(slide: Slide): slide is StaticImageData {
  return (
    isImageSlide(slide) &&
    typeof slide.width === 'number' &&
    typeof slide.height === 'number'
  );
}

export default function NextJsImage({
  slide,
}: Pick<RenderSlideProps, 'slide' | 'rect'>) {
  if (!isNextJsImage(slide)) return undefined;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Image
        alt=""
        src={slide}
        loading="eager"
        draggable={false}
        placeholder={slide.blurDataURL ? 'blur' : undefined}
        style={{ objectFit: 'cover', height: '100%' }}
        width={300}
        height={150}
      />
    </div>
  );
}
