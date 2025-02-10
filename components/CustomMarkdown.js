import ReactMarkdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeRaw from 'rehype-raw';

export default function CustomMarkdown({ children, className = '' }) {
  if (!children) return null;

  return (
    <ReactMarkdown
      className={className}
      rehypePlugins={[
        rehypeRaw,
        [
          rehypeExternalLinks,
          { target: '_blank', rel: ['nofollow', 'noopener', 'noreferrer'] },
        ],
      ]}
    >
      {children}
    </ReactMarkdown>
  );
}
