import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import CustomMarkdown from 'components/CustomMarkdown';

const PopupComponent = ({ showPopup, setShowPopup, selectedItem }) => {
  const popupRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (innerRef.current && !innerRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    if (showPopup) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showPopup, setShowPopup]);

  if (!showPopup) return null;

  return (
    <div ref={popupRef} className={`modal ${showPopup ? 'modal_active' : ''}`}>
      <div ref={innerRef} className={`modal_inner`}>
        <h3 className={`modal_title`}>{selectedItem.title}</h3>
        <div className={`modal_box`}>
          <div className={`modal_description`}>
            <CustomMarkdown>{selectedItem.description}</CustomMarkdown>
          </div>
          {selectedItem?.image?.data ? (
            <Image
              src={
                selectedItem.image.data[0].attributes?.formats?.medium?.url ||
                selectedItem.image.data[0].attributes?.url
              }
              alt={
                selectedItem.image.data.attributes?.alternativeText ||
                'Alpine Armoring'
              }
              width={400}
              height={400}
            />
          ) : null}
        </div>
        <button className={`modal_close`} onClick={() => setShowPopup(false)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            aria-hidden="true"
            focusable="false"
          >
            <g fill="currentColor">
              <path d="M0 0h24v24H0z" fill="none"></path>
              <path
                fill="#fff"
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              ></path>
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PopupComponent;
