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
  wrapTextOutsideTags(text, /(_)(\w+)(_)/g, '$1<em>$2</em>$3');

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

// export const useMarkdownToHtml = () => {
//   const convertMarkdown = (markdown) => {
//     // Replace bold text syntax with HTML bold tags
//     const boldRegex = /\*\*(.*?)\*\*/g;
//     let converted = markdown.replace(boldRegex, '<strong>$1</strong>');

//     // Replace heading syntax with HTML heading tags
//     const headingRegex = /^(#{1,6})\s+(.*)$/gm;
//     converted = converted.replace(headingRegex, (match, p1, p2) => {
//       const headingLevel = p1.length;
//       return `<h${headingLevel}>${p2}</h${headingLevel}>`;
//     });

//     // Replace link syntax with HTML anchor tags
//     const linkRegex = /\[(.*?)\]\((.*?)\)/g;
//     converted = converted.replace(linkRegex, '<a href="$2">$1</a>');

//     // Replace italic text syntax with HTML italic tags
//     function wrapWithEmOutsideLinks(text) {
//       // Split the input into segments that are outside and inside <a> tags
//       const parts = text.split(/(<a[^>]+>[^<]+<\/a>)/g);

//       // Apply the <em> wrapping only to segments outside <a> tags
//       const modifiedParts = parts.map((part) => {
//         if (!part.startsWith('<a')) {
//           const regex = /_(\w+)_/g;
//           return part.replace(regex, '<em>$1</em>');
//         }
//         return part;
//       });

//       return modifiedParts.join('');
//     }
//     converted = wrapWithEmOutsideLinks(converted);

//     // Replace underline text syntax with HTML underline tags
//     function wrapWithUOutsideTags(text) {
//       // Split the input into segments that are outside and inside HTML tags
//       const parts = text.split(/(<[^>]+>)/g);

//       // Apply the <u> wrapping only to segments outside HTML tags
//       const modifiedParts = parts.map((part) => {
//         if (!part.startsWith('<')) {
//           const underlineRegex = /\+(.*?)\+/g;
//           return part.replace(underlineRegex, '<u>$1</u>');
//         }
//         return part;
//       });

//       return modifiedParts.join('');
//     }
//     converted = wrapWithUOutsideTags(converted);

//     // Convert blockquotes
//     const blockquoteRegex = /^>(.*)$/gm;
//     converted = converted.replace(
//       blockquoteRegex,
//       '<blockquote>$1</blockquote>'
//     );

//     // Convert two spaces followed by a line break to <br> tags
//     converted = converted.replace(/ \n/g, '<br>');

//     // Wrap each paragraph in <p> tags if there are two line breaks
//     // This regex matches sequences of text that are separated by two line breaks
//     // It then wraps each sequence in <p> tags
//     converted = converted.replace(/(\n)/g, '</p><p>');

//     // Convert bullet lists to <ul> and <li> tags
//     const bulletListRegex = /^- (.*)$/gm;
//     converted = converted.replace(bulletListRegex, '<ul><li>$1</li></ul>');

//     // Ensure the first and last paragraphs are wrapped in <p> tags
//     // converted = `<p>${converted}</p>`;
//     converted = `${converted}`;

//     return converted;
//   };

//   return convertMarkdown;
// };
