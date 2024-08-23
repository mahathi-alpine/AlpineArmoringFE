export default function NextJsImage({ slide }) {
  return (
    <>
      {slide.src ? (
        <object
          data={`https://drive.google.com/file/d/${slide.src}/preview?usp=sharing`}
          type="application/pdf"
          style={{
            height: `${slide.height}px`,
            width: 830,
            maxHeight: `100vH`,
            maxWidth: '100%',
          }}
        >
          <embed
            src={`https://drive.google.com/file/d/${slide.src}/preview?usp=sharing`}
            style={{
              width: 830,
              height: `${slide.height}px`,
              maxHeight: `100vH`,
              maxWidth: '100%',
            }}
          />
        </object>
      ) : null}
    </>
  );
}
