export default function NextJsImage({ slide }) {
  return (
    <>
      {slide.src ? (
        <object
          data={`https://drive.google.com/file/d/${slide.src}/preview?usp=sharing`}
          type="application/pdf"
          style={{
            width: `${slide.width}px`,
            height: `${slide.height}px`,
            maxWidth: '100%',
          }}
        >
          <embed
            src={`https://drive.google.com/file/d/${slide.src}/preview?usp=sharing`}
            style={{
              width: `${slide.width}px`,
              height: `${slide.height}px`,
              maxWidth: '100%',
            }}
          />
        </object>
      ) : null}
    </>
  );
}
