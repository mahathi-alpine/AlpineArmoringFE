import Link from 'next/link';
import Image from 'next/image';
import Button from './Button';
import Navigation from './Navigation';
import styles from './Header.module.scss';

const Header = ({className}) => {
  const classNames = className?.split(' ').map(name => styles[name]).join(' ');
  return (
    <header className={`${styles.header} ${classNames} container`}>
      <div className={`${styles.header_wrapper}`}>

        <div className={`${styles.header_logo}`}>
          <Link href={'/'}>
              <Image
                  src="/AlpineArmoringLogoWhite.svg"
                  width={100}                    
                  height={30}
                  alt="Alpine Armoring"
                  priority='true'
              />
          </Link>
        </div>

        <Navigation/>

        <div className={`${styles.header_right}`}>

          <Button href="/contact" desktopOnly className="primary button--small desktop-only">Contact</Button>

          <Image
            src="/assets/search.svg"
            width={20}                    
            height={20}
            alt="Alpine Armoring Search"
            className="desktop-only"
          />

          <div className={`${styles.header_lang} desktop-only`}>EN</div>

          <div className={`${styles.header_burger}`}></div>

        </div>

      </div>
    </header>
  );
};

export default Header;