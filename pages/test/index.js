const Downloads = () => {
  return (
    <div>
      <video
        muted
        playsInline
        loop
        autoPlay
        style={{ maxWidth: '100%' }}
        src="https://d102sycao8uwt8.cloudfront.net/0058_web_vid_159363673c.mp4"
        type="video/mp4"
      >
        {/* <source src={``} type={`video/mp4`} /> */}
      </video>
    </div>
  );
};

// Reason: Override default Layout to render page without header/footer
Downloads.getLayout = (page) => page;

export default Downloads;
