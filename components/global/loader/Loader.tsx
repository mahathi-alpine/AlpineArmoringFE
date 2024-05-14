// import Link from 'next/link';
// import Image from 'next/image';
// import styles from './Default.module.scss';

const Default = (type) => {
  return (
    <>
      {type.type === '1' ? (
        <div className="loader1">
          <div className="car">
            <div className="strike"></div>
            <div className="strike strike2"></div>
            <div className="strike strike3"></div>
            <div className="strike strike4"></div>
            <div className="strike strike5"></div>
            <div className="car-detail spoiler"></div>
            <div className="car-detail back"></div>
            <div className="car-detail center"></div>
            <div className="car-detail center1"></div>
            <div className="car-detail front"></div>
            <div className="car-detail wheel"></div>
            <div className="car-detail wheel wheel2"></div>
          </div>

          <div className="text">
            <span>Loading</span>
            <span className="dots">...</span>
          </div>
        </div>
      ) : null}

      {type.type === '2' ? (
        <div className="loader2">
          <div className="preloader">
            <div className="loader"></div>
          </div>
        </div>
      ) : null}

      {type.type === '3' ? (
        <div className="loader3">
          <div className="loader">
            <div className="bounce">
              <svg
                x="0"
                y="0"
                viewBox="0 0 200 200"
                width="100px"
                className="wheel"
              >
                <path
                  d="M196.93 94.63L194.3 77.3s-8.19-2.88-8.24-3.08l5.46-6.62-7.38-15.97-8.49-.15c-.1-.15 3.03-8.39 3.03-8.39l-11.57-13.24s-8.44 1.97-8.59 1.87l1.01-8.54-14.81-9.45s-7.58 4.3-7.73 4.2l-1.47-8.44-16.83-4.95s-6.01 6.27-6.22 6.22L108.68 3l-17.59.1-3.69 7.63c-.2.05-6.37-6.22-6.37-6.22L64.2 9.57s-1.72 8.49-1.87 8.59L55 13.71l-14.76 9.55s.81 8.69.66 8.79l-8.34-2.22-11.47 13.35s3.18 8.09 3.08 8.24l-8.59.25L8.35 67.7l5.41 6.52c-.05.2-8.34 3.18-8.34 3.18L3 94.79l7.08 4.75v.56l-7.13 4.85 2.58 17.39s8.19 2.88 8.24 3.08l-5.51 6.57 7.38 15.97s8.69.45 8.79.61l-3.34 7.94 4.17 4.78-.03.03 1.01 1.11 6.37 7.33s8.44-1.97 8.59-1.87l-1.01 8.54 14.81 9.4 7.23-4.45c.15.1 1.97 8.69 1.97 8.69l16.83 4.9s6.01-6.27 6.22-6.22l3.79 7.73h17.54l3.69-7.63c.2-.05 6.37 6.22 6.37 6.22l6.21-1.84.01.02 10.61-3.18 1.36-8.34c.15-.1 7.83 4.2 7.83 4.2l14.76-9.6-1.06-8.44c.15-.1 8.74 1.87 8.74 1.87l11.47-13.34-3.39-7.78c.1-.15 8.9-.71 8.9-.71l7.23-16.02s-5.16-6.82-5.1-7.03l8.19-2.63 2.48-17.44s-7.08-4.95-7.08-5.05c0-.12 7.13-5.13 7.13-5.13zm-96.99 75.43c-38.77 0-70.32-31.55-70.32-70.32 0-38.78 31.55-70.32 70.32-70.32 38.78 0 70.32 31.55 70.32 70.32 0 38.77-31.54 70.32-70.32 70.32z"
                  transform-origin="100px 100px"
                />
                <path
                  d="M99.94 36.83c-34.69 0-62.91 28.22-62.91 62.91s28.22 62.91 62.91 62.91 62.91-28.22 62.91-62.91-28.22-62.91-62.91-62.91zm39.88 22.83c.86-.81 2.17-.76 2.93.1.81.86.76 2.17-.1 2.93-.86.81-2.17.76-2.93-.1-.81-.86-.76-2.17.1-2.93zm-2.88 18.75c.66 1.11.25 2.58-.86 3.18l-8.85 5.1c-1.11.66-2.58.25-3.18-.86-.66-1.11-.25-2.58.86-3.18l8.85-5.1c1.05-.66 2.52-.3 3.18.86zm-9.46-28.05c.61-.96 1.87-1.31 2.88-.71.96.61 1.31 1.87.71 2.88-.61.96-1.87 1.31-2.88.71-.96-.61-1.31-1.92-.71-2.88zm-14.35-5.61c.3-1.11 1.47-1.77 2.58-1.47 1.11.3 1.77 1.47 1.47 2.58-.3 1.11-1.47 1.77-2.58 1.47-1.12-.36-1.77-1.47-1.47-2.58zm-3.18 10.01l.01-.05c1.26.25 2.47.61 3.68.96 7.23 2.22 13.7 6.22 18.9 11.42.45.45.91.96 1.36 1.42l-.05.05-17.64 13.74c-2.63-2.48-5.81-4.35-9.35-5.41l3.09-22.13zM99.89 41.11c1.16 0 2.07.96 2.07 2.07 0 1.16-.91 2.07-2.07 2.07-1.16 0-2.07-.91-2.07-2.07 0-1.16.91-2.07 2.07-2.07zm-15.82 2.17c1.11-.3 2.27.35 2.58 1.47.3 1.11-.35 2.27-1.47 2.58-1.11.3-2.27-.35-2.58-1.47-.3-1.11.36-2.27 1.47-2.58zm-14.66 6.37c.96-.61 2.27-.3 2.88.71.61.96.3 2.27-.71 2.88-1.01.61-2.27.3-2.88-.71-.6-1.01-.25-2.27.71-2.88zM65.92 68.5c.45-.45.86-.96 1.36-1.42.51-.51 1.06-1.01 1.62-1.52 1.62-1.47 3.39-2.88 5.21-4.09.61-.4 1.26-.81 1.87-1.21 1.26-.76 2.58-1.47 3.94-2.12.66-.3 1.36-.66 2.02-.91 1.36-.61 2.78-1.11 4.25-1.57 1.2-.35 2.39-.7 3.64-.95l3.08 22.13c-3.54 1.06-6.72 2.93-9.35 5.41L65.87 68.5h.05zm-3.08 9.91c.66-1.11 2.07-1.52 3.18-.86l8.84 5.1c1.11.66 1.52 2.07.86 3.18-.66 1.11-2.07 1.52-3.18.86l-8.85-5.1c-1.1-.65-1.51-2.07-.85-3.18zm-5.81-18.65c.81-.86 2.12-.91 2.93-.1.86.81.91 2.12.1 2.93-.81.86-2.12.91-2.93.1-.86-.81-.91-2.12-.1-2.93zM42.47 87.81c.25-1.11 1.31-1.87 2.48-1.62 1.11.25 1.87 1.31 1.62 2.48-.25 1.11-1.31 1.87-2.48 1.62-1.11-.2-1.87-1.32-1.62-2.48zm-1.11 15.97c-.1-1.16.81-2.12 1.92-2.22 1.16-.1 2.12.81 2.22 1.92.1 1.16-.81 2.12-1.92 2.22-1.11.1-2.12-.8-2.22-1.92zm5.96 16.88c-1.11.4-2.33-.15-2.68-1.26-.4-1.06.2-2.27 1.26-2.68 1.06-.4 2.27.2 2.68 1.26.41 1.07-.2 2.28-1.26 2.68zm1.42-45.03c-1.06-.56-1.47-1.82-.91-2.83.51-1.01 1.77-1.42 2.83-.91 1.01.51 1.41 1.77.91 2.83-.51 1.01-1.77 1.42-2.83.91zm6.11 58.48c-.96.66-2.22.45-2.88-.51-.66-.96-.45-2.22.51-2.88.96-.66 2.22-.45 2.88.51.66.91.45 2.22-.51 2.88zm-1.11-34.32c0-2.38.2-4.75.56-7.03.25-1.52.56-3.03.91-4.5.2-.76.4-1.47.61-2.17 0-.04.03-.05.04-.08l20.68 8.42c-.4 1.72-.61 3.54-.61 5.41s.2 3.64.61 5.36l-20.72 8.44v-.1c-1.37-4.35-2.08-8.95-2.08-13.75zm21.13 17.13l-8.84 5.1c-1.11.61-2.53.25-3.18-.86-.66-1.11-.25-2.58.86-3.18l8.85-5.1c1.11-.66 2.58-.25 3.18.86.65 1.11.24 2.58-.87 3.18zm-9.05 28.06c-.71.91-2.02 1.01-2.93.3-.91-.71-1.01-2.02-.3-2.93.71-.91 2.02-1.01 2.93-.3.86.7 1.01 2.02.3 2.93zm13.45 7.53c-.45 1.06-1.67 1.52-2.73 1.06-1.06-.45-1.52-1.67-1.06-2.73.45-1.06 1.67-1.52 2.73-1.06 1.01.4 1.51 1.67 1.06 2.73zm10.46-7.71c-1.18-.25-2.36-.59-3.53-.94-1.47-.45-2.88-.96-4.25-1.57-.71-.3-1.36-.61-2.02-.91-1.36-.66-2.68-1.36-3.94-2.12-.66-.4-1.26-.81-1.87-1.21-1.82-1.26-3.59-2.63-5.21-4.09-.56-.51-1.06-1.01-1.62-1.52-.45-.45-.91-.96-1.36-1.42l-.05-.05 17.64-13.75c2.63 2.48 5.81 4.35 9.3 5.41l-3.08 22.14-.01.03zm4.5 11.3c-.15 1.16-1.21 1.92-2.32 1.77-1.16-.15-1.92-1.21-1.77-2.32.15-1.16 1.21-1.92 2.33-1.77 1.15.14 1.91 1.15 1.76 2.32zm7.98-15.93c0 1.31-1.06 2.32-2.33 2.32-1.31 0-2.32-1.06-2.32-2.32v-10.21c0-1.31 1.06-2.33 2.32-2.33 1.31 0 2.33 1.06 2.33 2.33v10.21zm0-70.6c0 1.31-1.06 2.32-2.33 2.32-1.31 0-2.32-1.06-2.32-2.32V59.36c0-1.31 1.06-2.32 2.32-2.32 1.31 0 2.33 1.06 2.33 2.32v10.21zm5.66 88.29c-1.16.15-2.17-.66-2.32-1.77-.15-1.16.66-2.17 1.77-2.32 1.16-.15 2.17.66 2.32 1.77.15 1.11-.6 2.17-1.77 2.32zm15.37-4.29c-1.06.46-2.27-.05-2.73-1.06-.45-1.06.05-2.27 1.06-2.73 1.06-.45 2.27.05 2.73 1.06.51 1.06 0 2.27-1.06 2.73zm-13.34-8.75l-3.08-22.14c3.54-1.06 6.72-2.93 9.35-5.41l17.69 13.75c-6.27 6.83-14.61 11.73-23.96 13.8zm14.15-31.08c.66-1.11 2.07-1.52 3.18-.86l8.85 5.1c1.11.61 1.52 2.02.86 3.18-.66 1.11-2.07 1.52-3.18.86l-8.85-5.1c-1.11-.65-1.52-2.07-.86-3.18zm12.84 31.54c-.91.71-2.22.61-2.93-.3-.71-.91-.61-2.22.3-2.93.91-.71 2.22-.61 2.93.3.76.86.61 2.17-.3 2.93zm21.53-41.5c-.1 1.16-1.06 2.02-2.22 1.92-1.16-.1-2.02-1.06-1.92-2.22.1-1.16 1.06-2.02 2.22-1.92 1.11.05 1.97 1.06 1.92 2.22zm-3.59-17.59c1.16-.2 2.22.51 2.48 1.62.25 1.11-.51 2.22-1.62 2.48-1.11.25-2.22-.51-2.48-1.62-.25-1.11.51-2.22 1.62-2.48zm-.96 30.53c1.11.4 1.67 1.62 1.26 2.68-.4 1.06-1.57 1.67-2.68 1.26-1.06-.4-1.67-1.57-1.26-2.68.4-1.06 1.57-1.66 2.68-1.26zm-4.7-44.83c1.01-.51 2.27-.15 2.83.91.51 1.01.15 2.27-.91 2.83-1.01.51-2.27.15-2.83-.91-.51-1.06-.1-2.27.91-2.83zm-1.87 58.83c.96.61 1.16 1.92.51 2.88-.66.96-1.97 1.16-2.88.51-.96-.66-1.16-1.97-.51-2.88.65-.96 1.97-1.16 2.88-.51zm-1.77-38.01c.35 2.27.56 4.65.56 7.03 0 4.85-.76 9.5-2.12 13.85l-20.72-8.44c.4-1.72.61-3.54.61-5.41s-.2-3.64-.61-5.36l20.72-8.44c.25.76.45 1.52.66 2.27.34 1.47.65 2.99.9 4.5z"
                  transform-origin="100px 100px"
                />
              </svg>
            </div>
            Loading...
          </div>
        </div>
      ) : null}

      {type.type === '4' ? (
        <div className="loaderAbsolute">
          <div className="loaderAbsolute_inner">
            <div className="text">
              <span>Loading</span>
              <span className="dots">...</span>
            </div>
            <img src="/assets/Alpine-loading-icon.gif" />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Default;
