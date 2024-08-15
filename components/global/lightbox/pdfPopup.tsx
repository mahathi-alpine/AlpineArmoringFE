export default function NextJsImage({ slide }) {
  return (
    <>
      {slide.src ? (
        <object
          data={`${slide.src}`}
          type="application/pdf"
          style={{
            width: 830,
            height: `100vH`,
            maxWidth: '100%',
          }}
        >
          <embed
            src={`${slide.src}`}
            style={{
              width: 830,
              height: `100vH`,
              maxWidth: '100%',
            }}
          />
        </object>
      ) : null}
    </>
  );
}
