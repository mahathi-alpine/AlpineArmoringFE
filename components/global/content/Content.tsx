import CustomMarkdown from 'components/CustomMarkdown';
import Image from 'next/image';

function Content(props) {
  // console.log(props);
  // return null;
  const dynamicZone = props.data.dynamicZone;

  return (
    <>
      {dynamicZone?.map((component, index) => {
        switch (component.__component) {
          case 'slices.text': {
            return (
              <CustomMarkdown key={index}>{component.Content}</CustomMarkdown>
            );
          }
          case 'slices.youtube-video': {
            return (
              <iframe
                src={`https://www.youtube.com/embed/${component.url}?controls=0&showinfo=0&modestbranding=1`}
                title={props.data.title}
                frameBorder="0"
                allow="autoplay"
                allowFullScreen
                key={index}
              ></iframe>
            );
          }
          case 'slices.single-media':
            if (component.media.data) {
              if (component.media.data?.attributes.mime.startsWith('video/')) {
                return (
                  <video autoPlay muted loop key={index}>
                    <source
                      src={component.media.data.attributes.url}
                      type={component.media.data.attributes.mime}
                    />
                  </video>
                );
              } else {
                return (
                  <Image
                    key={index}
                    src={
                      component.media.data?.attributes.formats.large?.url ||
                      component.media.data?.attributes.url
                    }
                    alt={component.media.data?.attributes.alternativeText || ''}
                    width={
                      component.media.data?.attributes.formats.large?.width ||
                      component.media.data?.attributes.width
                    }
                    height={
                      component.media.data?.attributes.formats.large?.height ||
                      component.media.data?.attributes.height
                    }
                    quality={100}
                  />
                );
              }
            }
            return null;
          default:
            return null;
        }
      })}
    </>
  );
}

export default Content;
