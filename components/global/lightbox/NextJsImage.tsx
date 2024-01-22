import Image, { StaticImageData } from 'next/image';
import {
  RenderSlideProps,
  isImageFitCover,
  useLightboxProps,
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
  // rect,
}: Pick<RenderSlideProps, 'slide' | 'rect'>) {
  const { imageFit } = useLightboxProps().carousel;
  const cover = isImageSlide(slide) && isImageFitCover(slide, imageFit);

  // console.log(isImageFitCover(slide, imageFit))

  if (!isNextJsImage(slide)) return undefined;

  //   const width = !cover
  //     ? Math.round(
  //         Math.min(rect.width, (rect.height / slide.height) * slide.width)
  //       )
  //     : rect.width;

  //   const height = !cover
  //     ? Math.round(
  //         Math.min(rect.height, (rect.width / slide.width) * slide.height)
  //       )
  //     : rect.height;
  const width = slide.width;
  // const height = slide.height;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Image
        fill
        alt=""
        src={slide}
        loading="eager"
        draggable={false}
        placeholder={slide.blurDataURL ? 'blur' : undefined}
        style={{ objectFit: cover ? 'cover' : 'contain' }}
        sizes={`${Math.ceil((width / window.innerWidth) * 100)}vw`}
      />
    </div>
  );
}
