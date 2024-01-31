import styles from './InventoryVehicle.module.scss';
import { getPageData } from 'lib/api';
import { useEffect } from 'react';
import InfoIcon from 'components/icons/Info';
import PDFIcon from 'components/icons/PDF';
import Link from 'next/link';
// import ChevronIcon from 'components/icons/Chevron';
import Markdown from 'markdown-to-jsx';
import StickyHorizontalSlider from 'components/global/sticky-horizontal-slider/StickyHorizontalSlider';

import Button from 'components/global/button/Button';
import TabSlider from 'components/global/tab-slider/TabSlider';
import Carousel from 'components/global/carousel/Carousel';
import VideoScale, {
  animateVideo,
} from 'components/global/video-scale/VideoScale';

// import { Lightbox } from 'yet-another-react-lightbox';
// import 'yet-another-react-lightbox/styles.css';
// import Captions from 'yet-another-react-lightbox/plugins/captions';
// import 'yet-another-react-lightbox/plugins/captions.css';

function InventoryVehicle(props) {
  // const [activeDiv, setActiveDiv] = useState('0');

  const handleTabChange = (index, titleNav) => {
    // setActiveDiv(id);
    // setViewMoreClicked(false);
    const targetId = titleNav.toLowerCase().replace(/\s+/g, '-');

    const targetElement = document.getElementById(targetId);
    targetElement.scrollIntoView({ behavior: 'smooth' });
  };

  // const [openSpecs, setOpenSpecs] = useState(false);
  // const [openAccessories, setOpenAccessories] = useState(false);

  // const [viewMoreClicked, setViewMoreClicked] = useState(false);
  // const handleViewMoreClick = () => {
  //   setViewMoreClicked(!viewMoreClicked);
  // };

  // useEffect(() => {
  //   document.body.classList.add('listing-inventory', 'background-dark');
  //   return () => {
  //     document.body.classList.remove('listing-inventory', 'background-dark');
  //   };
  // }, []);

  useEffect(() => {
    const targets = document.querySelectorAll('.observe');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.toggle('in-view', entry.isIntersecting);
          observer.unobserve(entry.target);

          // VideoScale
          if (entry.target.classList.contains('videoScaleContainer')) {
            window.addEventListener(
              'scroll',
              () => animateVideo(entry.target),
              { passive: true }
            );
          }
        } else {
          if (entry.target.classList.contains('videoScaleContainer')) {
            window.removeEventListener('scroll', () =>
              animateVideo(entry.target)
            );
          }
        }
      });
    });

    targets.forEach((item) => observer.observe(item));

    return () => {
      targets.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, []);

  if (!props.data.data) {
    return null;
  }
  const data = props.data.data[0].attributes;
  const topGallery = data.gallery?.data;
  const mainText = data.description;
  const category = data.category.data.attributes.title;
  const categorySlug = data.category.data.attributes.slug;
  // console.log(data)

  const sliderTopOptions = { dragFree: false, loop: true, thumbs: true };

  const vehicleDetailsMain = {
    VIN: 'VIN',
    'Vehicle ID': 'vehicleID',
    Engine: 'engine',
    Trans: 'trans',
    Power: 'power',
    Year: 'year',
    'Color (EXT)': 'color_ext',
    'Color (INT)': 'color_int',
    Trim: 'trim',
    'Drive Train': 'driveTrain',
  };
  const vehicleDetailsSecondary = {
    Wheels: 'wheels',
    Height: 'height',
    Length: 'length',
    Width: 'width',
    Wheelbase: 'wheelbase',
    Weight: 'weight',
  };

  const tabSliderData = [
    {
      id: 0,
      titleNav: 'OEM Specs',
    },
    {
      id: 1,
      titleNav: 'Armoring Specs',
    },
    {
      id: 2,
      titleNav: 'Options Included',
    },
  ];

  // console.log(data);
  // return null;

  return (
    <div className={`${styles.inventory}`}>
      <div className="background-dark">
        <div className={`${styles.inventory_top}`}>
          <div className={`${styles.inventory_top_gallery}`}>
            <div className={`${styles.inventory_top_gallery_description}`}>
              <InfoIcon />
              <p>
                {data.shortDescription
                  ? data.shortDescription
                  : 'This armored vehicle is in stock and available to ship immediately'}
              </p>
            </div>

            <div className={`${styles.inventory_top_gallery_wrap}`}>
              {topGallery ? (
                <Carousel slides={topGallery} options={sliderTopOptions} />
              ) : null}

              <div className={`${styles.inventory_armor}`}>
                Armor
                <br />
                Level
                <span>{data.armor_level}</span>
              </div>
            </div>

            <div className={`${styles.inventory_right_bottom}`}>
              <ul
                className={`${styles.inventory_tabs_content_list} ${styles.inventory_tabs_content_list_secondary}`}
              >
                {Object.entries(vehicleDetailsSecondary).map(([key, value]) => {
                  return (
                    data[value] != null && (
                      <li
                        key={key}
                        className={`${styles.inventory_tabs_content_list_item}`}
                      >
                        {`${key}:`}
                        <span>{`${data[value]}`}</span>
                      </li>
                    )
                  );
                })}
              </ul>

              <Link href="" className={`${styles.inventory_sticker}`}>
                <span className={`${styles.inventory_sticker_part1}`}>
                  Window
                </span>
                <span className={`${styles.inventory_sticker_part2}`}>
                  Sticker
                </span>
                <span className={`${styles.inventory_sticker_bottom}`}>
                  <PDFIcon />
                  <span>OEM</span>
                </span>
              </Link>
            </div>

            <div
              className={`${styles.inventory_top_shape} shape-before shape-before-dark mobile-only`}
            ></div>
          </div>

          <div className={`${styles.inventory_details}`}>
            <div className={`${styles.inventory_breadcrumbs}`}>
              <Link href="/available-now">Available now</Link>
              <span>&gt;</span>
              <Link href={`/available-now/type/${categorySlug}`}>
                {category}
              </Link>
            </div>

            <div className={`${styles.inventory_details_title}`}>
              {data.titleDisplay ? (
                <h1
                  dangerouslySetInnerHTML={{ __html: data.titleDisplay }}
                ></h1>
              ) : data.title ? (
                data.title
              ) : null}
            </div>

            <div className={`${styles.inventory_details_description}`}>
              <InfoIcon />
              <p>
                This armored vehicle is in stock and available to ship
                immediately
              </p>
            </div>

            <div className={`${styles.inventory_tabs}`}>
              <TabSlider
                className={`${styles.inventory_tabs_slider}`}
                props={tabSliderData}
                onTabChange={handleTabChange}
                anchor
              />

              <div
                // className={`${styles.inventory_tabs_content} ${
                //   viewMoreClicked ? styles.inventory_tabs_content_active : ''
                // }`}
                className={`${styles.inventory_tabs_content}`}
              >
                <div
                  // className={`${styles.inventory_tabs_content_item} ${
                  //   activeDiv == '0'
                  //     ? styles.inventory_tabs_content_item_active
                  //     : ''
                  // }`}
                  className={`${styles.inventory_tabs_content_item}`}
                >
                  <ul className={`${styles.inventory_tabs_content_list}`}>
                    {Object.entries(vehicleDetailsMain).map(([key, value]) => {
                      return (
                        data[value] != null && (
                          <li
                            key={key}
                            className={`${styles.inventory_tabs_content_list_item}`}
                          >
                            {`${key}:`}
                            <span>{`${data[value]}`}</span>
                          </li>
                        )
                      );
                    })}
                  </ul>
                  <ul
                    className={`${styles.inventory_tabs_content_list} ${styles.inventory_tabs_content_list_secondary}`}
                  >
                    {Object.entries(vehicleDetailsSecondary).map(
                      ([key, value]) => {
                        return (
                          data[value] != null && (
                            <li
                              key={key}
                              className={`${styles.inventory_tabs_content_list_item}`}
                            >
                              {`${key}:`}
                              <span>{`${data[value]}`}</span>
                            </li>
                          )
                        );
                      }
                    )}
                  </ul>
                </div>

                {/* <div
                  className={`
                    ${styles.inventory_tabs_content_item} 
                    ${
                      activeDiv == '1'
                        ? styles.inventory_tabs_content_item_active
                        : ''
                    }
                  `}
                >
                  <ul className={`${styles.inventory_tabs_content_list}`}>
                    {data.specifications.data.map((item, index) => (
                      <li
                        key={index}
                        className={`
                          ${styles.inventory_tabs_content_list_item}
                          ${styles.inventory_tabs_content_list_item_specs}
                        `}
                        onClick={() => {
                          setOpenSpecs(true);
                          // setSelectedIndex(index);
                        }}
                      >
                        {`${item.attributes.title}`}
                      </li>
                    ))}
                  </ul>

                  <Lightbox
                    open={openSpecs}
                    close={() => setOpenSpecs(false)}
                    slides={data.specifications.data.map((item) => ({
                      src: item.attributes?.image.data.attributes.url,
                      title: item.attributes?.title,
                    }))}
                    plugins={[Captions]}
                  />
                </div>

                <div
                  className={`${styles.inventory_tabs_content_item} ${
                    activeDiv == '2'
                      ? styles.inventory_tabs_content_item_active
                      : ''
                  }`}
                >
                  <ul className={`${styles.inventory_tabs_content_list}`}>
                    {data.accessories.data.map((item, index) => (
                      <li
                        key={index}
                        className={`
                          ${styles.inventory_tabs_content_list_item}
                          ${styles.inventory_tabs_content_list_item_specs}
                        `}
                        onClick={() => {
                          setOpenAccessories(true);
                          // setSelectedIndex(index);
                        }}
                      >
                        {`${item.attributes.title}`}
                      </li>
                    ))}
                  </ul>
                  <Lightbox
                    open={openAccessories}
                    close={() => setOpenAccessories(false)}
                    slides={data.accessories.data.map((item) => ({
                      src: item.attributes?.image.data.attributes.url,
                      title: item.attributes?.title,
                    }))}
                    plugins={[Captions]}
                  />
                </div> */}
              </div>

              {/* {!viewMoreClicked && (
                <div
                  className={`${styles.inventory_tabs_content_viewMore} mobile-only`}
                  onClick={handleViewMoreClick}
                >
                  <span>View More</span>
                  <ChevronIcon />
                </div>
              )} */}
            </div>

            <div className={`${styles.inventory_top_button}`}>
              <Button
                href="/contact"
                className={`${styles.inventory_top_button_link} primary rounded`}
              >
                Request a quote
              </Button>

              <Link href="" className={`${styles.inventory_sticker}`}>
                <span className={`${styles.inventory_sticker_box}`}>
                  <span className={`${styles.inventory_sticker_part1}`}>
                    Window
                  </span>
                  <span className={`${styles.inventory_sticker_part2}`}>
                    Sticker
                  </span>
                </span>
                <span className={`${styles.inventory_sticker_bottom}`}>
                  <PDFIcon />
                  <span>OEM</span>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {mainText ? (
          <div
            className={`${styles.inventory_description} container_small observe fade-in-up`}
          >
            <Markdown>{mainText}</Markdown>
          </div>
        ) : null}

        {data.specifications ? (
          <div
            id="armoring-specs"
            className={`${styles.inventory_specs} anchor`}
          >
            <StickyHorizontalSlider
              slides={data.specifications.data}
              title="Armoring Specifications"
              inventory
            />
          </div>
        ) : null}

        {data.accessories ? (
          <div id="options-included" className={`anchor`}>
            <StickyHorizontalSlider
              slides={data.accessories.data}
              title="Options Included"
              inventory
            />
          </div>
        ) : null}

        <VideoScale
          video={data.video.data.attributes.url}
          text1="Armored Cadillac"
          text2="ESV V-Series"
        />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const data = await getPageData({
    route: 'inventories',
    params: `filters[slug][$eq]=${context.params.slug}`,
    // populate: 'deep',
  });

  return {
    props: { data },
  };
}

export default InventoryVehicle;
