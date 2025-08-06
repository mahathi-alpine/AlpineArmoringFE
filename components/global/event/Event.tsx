import styles from './Event.module.scss';
import Image from 'next/image';
import Button from 'components/global/button/Button';
import CustomMarkdown from 'components/CustomMarkdown';

const Event = (props) => {
  const data = props.data;

  return (
    <div className={`${styles.event}`}>
      {data.ribbon && (
        <div className={`${styles.event_ribbon}`}>{data.ribbon}</div>
      )}
      <div className={`${styles.event_inner}`}>
        <div className={`${styles.event_image}`}>
          {data.media && (
            <Image
              src={data.media.data[0].attributes.formats.medium.url}
              alt="Alpine Armoring IACP"
              width={700}
              height={300}
            />
          )}
        </div>
        <div className={`${styles.event_content}`}>
          <div className={`${styles.event_info}`}>
            <p>{data.date}</p>
            <p>{data.location}</p>
          </div>

          <h3 className={`${styles.event_title}`}>{data.title}</h3>
          <CustomMarkdown>{data.description}</CustomMarkdown>

          {data.url && (
            <Button
              href={data.url}
              className={`${styles.event_button} rounded primary`}
            >
              More Info
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Event;
