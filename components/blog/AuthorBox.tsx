import Link from 'next/link';
import CustomMarkdown from 'components/CustomMarkdown';
import LinkedinIcon from 'components/icons/Linkedin';
import useLocale from 'hooks/useLocale';
import styles from './AuthorBox.module.scss';

interface AuthorBoxProps {
  author: {
    Name: string;
    slug: string;
    position: string;
    description?: string;
    linkedinURL?: string;
  };
}

const AuthorBox = ({ author }: AuthorBoxProps): JSX.Element => {
  const { lang } = useLocale();

  if (!author) {
    return null;
  }

  return (
    <div className={styles.authorBox}>
      <div className={styles.authorBox_header}>
        <h2 className={styles.authorBox_title}>
          {lang?.aboutTheAuthor || 'About the Author'}
        </h2>
      </div>

      <div className={styles.authorBox_content}>
        <div className={styles.authorBox_info}>
          <Link
            href={`${lang?.authorURL || '/author'}/${author.slug}`}
            className={styles.authorBox_name}
          >
            {author.Name} - {author.position}
          </Link>

          {author.linkedinURL && (
            <Link
              href={author.linkedinURL}
              target="_blank"
              className={styles.authorBox_linkedin}
              aria-label={`${author.Name} on LinkedIn`}
            >
              <LinkedinIcon />
            </Link>
          )}
        </div>

        {author.description && (
          <div className={`${styles.authorBox_description} static`}>
            <CustomMarkdown>{author.description}</CustomMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorBox;
