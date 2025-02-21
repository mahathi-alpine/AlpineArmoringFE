import ReactMarkdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeRaw from 'rehype-raw';

export default function CustomMarkdown({ children }) {
  if (!children) return null;

  return (
    <ReactMarkdown
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
