import Image from 'next/image';

const Default = () => {
  return (
    <div className="loaderAbsolute">
      <div className="loaderAbsolute_inner">
        <Image
          src="/assets/Alpine-loading-icon-clean.gif"
          alt="Alpine loading gif"
          width={120}
          height={120}
        />
      </div>
    </div>
  );
};

export default Default;
