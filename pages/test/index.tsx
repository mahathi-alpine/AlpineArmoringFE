export default function Custom404() {
  return (
    <>
      <div className={`boxA`}>
        1
        <video
          muted={true}
          autoPlay={true}
          playsInline={true}
          loop={true}
          width={1920}
          height={1200}
          preload="metadata"
          src={`/assets/videoTest.mp4`}
        ></video>
      </div>
      <div className={`boxA`}>
        2
        <video
          muted={true}
          autoPlay={true}
          playsInline={true}
          loop={true}
          width={1920}
          height={1200}
          preload="metadata"
        >
          <source src={`/assets/videoTest.mp4`} type="video/mp4"></source>
        </video>
      </div>
      <div className={`boxA`}>
        3
        <video width={1920} height={1200}>
          <source src={`/assets/videoTest.mp4`} type="video/mp4"></source>
        </video>
      </div>
      <div className={`boxA`}>
        4
        <video width={1920} height={1200} src={`/assets/videoTest.mp4`}></video>
      </div>
      <div className={`boxA`}>
        5
        <video
          width={1920}
          height={1200}
          muted={true}
          autoPlay={true}
          playsInline={true}
          loop={true}
        >
          <source src={`/assets/videoTest.mp4`} type="video/mp4"></source>
        </video>
      </div>
    </>
  );
}
