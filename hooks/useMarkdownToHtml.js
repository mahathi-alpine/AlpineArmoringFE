const replaceBold = (text) =>
  text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

const replaceHeadings = (text) =>
  text.replace(
    /^(#{1,6})\s+(.*)$/gm,
    (_, level, content) => `<h${level.length}>${content}</h${level.length}>`
  );

const replaceLinks = (text) =>
  text.replace(/\[(.*?)\]\((.*?)\)/g, (match, linkText, url) => {
    const isExternal =
      !url.startsWith('/') && !url.includes('https://www.alpineco.com/');
    const attributes = isExternal
      ? ' target="_blank" rel="noopener noreferrer"'
      : '';
    return `<a href="${url}"${attributes}>${linkText}</a>`;
  });

const replaceItalic = (text) =>
  wrapTextOutsideTags(text, /_([^_]+)_/g, '<em>$1</em>');

const replaceUnderline = (text) =>
  wrapTextOutsideTags(text, /(\+)(\w+)(\+)/g, '$1<u>$2</u>$3');

const replaceBlockquotes = (text) =>
  text.replace(/^>(.*)$/gm, '<blockquote>$1</blockquote>');

const replaceLineBreaks = (text) =>
  text.replace(/ \n/g, '<br>').replace(/\n/g, '</p><p>');

const replaceBulletLists = (text) =>
  text.replace(/^- (.*)$/gm, '<ul><li>$1</li></ul>');

function wrapTextOutsideTags(text, regex, replacement) {
  const parts = text.split(/(<[^>]+>)/g);
  return parts
    .map((part) =>
      part.startsWith('<') ? part : part.replace(regex, replacement)
    )
    .join('');
}

export const useMarkdownToHtml = () => {
  const convertMarkdown = (markdown) =>
    replaceBulletLists(
      replaceLineBreaks(
        replaceBlockquotes(
          replaceUnderline(
            replaceItalic(replaceLinks(replaceHeadings(replaceBold(markdown))))
          )
        )
      )
    );

  return convertMarkdown;
};
