import Image from 'next/image';

// Define the props interface
interface HeaderItemProps {
  src: string;
  alt: string;
  mobileWidth?: number;
  mobileHeight?: number;
  desktopWidth: number;
  desktopHeight: number;
  styles: any;
}

const HeaderItem: React.FC<HeaderItemProps> = ({
  src,
  alt,
  mobileWidth,
  mobileHeight,
  desktopWidth,
  desktopHeight,
  styles,
}) => (
  <div className={styles.ballistic_header_item}>
    {/* Mobile Image */}
    {mobileWidth && mobileHeight && (
      <Image
        src={`/assets/ballistic/${src}_mobile.png`}
        alt={alt}
        title={alt}
        width={mobileWidth}
        height={mobileHeight}
        className="untilLarge-only"
        quality={100}
        priority
        unoptimized
      />
    )}
    {/* Desktop Image */}
    <Image
      src={`/assets/ballistic/${src}.png`}
      alt={alt}
      title={alt}
      width={desktopWidth}
      height={desktopHeight}
      className={mobileWidth ? 'large-only' : ''}
      quality={100}
      priority
      unoptimized
    />
  </div>
);

export default HeaderItem;
