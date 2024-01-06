import styles from './HPMiddleText.module.scss';
import Markdown from 'markdown-to-jsx';

const HPMiddleText = ({ props }) => {
  return (
    <Markdown
      className={`${styles.text_columns} observe fade-in-up container_small`}
    >
      {props}
    </Markdown>
  );
};

export default HPMiddleText;
