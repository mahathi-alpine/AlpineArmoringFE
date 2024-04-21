export const useMarkdownToHtml = () => {
  const convertMarkdown = (markdown) => {
    // Replace bold text syntax with HTML bold tags
    const boldRegex = /\*\*(.*?)\*\*/g;
    let converted = markdown.replace(boldRegex, '<strong>$1</strong>');

    // Replace italic text syntax with HTML italic tags
    const italicRegex = /_(.*?)_/g;
    converted = converted.replace(italicRegex, '<em>$1</em>');

    // Replace underline text syntax with HTML underline tags
    // Note: Underline is not standard in HTML, so we'll use <u> for demonstration
    const underlineRegex = /\+(.*?)\+/g;
    converted = converted.replace(underlineRegex, '<u>$1</u>');

    // Replace heading syntax with HTML heading tags
    const headingRegex = /^(#{1,6})\s+(.*)$/gm;
    converted = converted.replace(headingRegex, (match, p1, p2) => {
      const headingLevel = p1.length;
      return `<h${headingLevel}>${p2}</h${headingLevel}>`;
    });

    // Replace link syntax with HTML anchor tags
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    converted = converted.replace(linkRegex, '<a href="$2">$1</a>');

    // Convert blockquotes
    const blockquoteRegex = /^>(.*)$/gm;
    converted = converted.replace(
      blockquoteRegex,
      '<blockquote>$1</blockquote>'
    );

    // Convert two spaces followed by a line break to <br> tags
    converted = converted.replace(/ \n/g, '<br>');

    // Wrap each paragraph in <p> tags if there are two line breaks
    // This regex matches sequences of text that are separated by two line breaks
    // It then wraps each sequence in <p> tags
    converted = converted.replace(/(\n)/g, '</p><p>');

    // Convert bullet lists to <ul> and <li> tags
    const bulletListRegex = /^- (.*)$/gm;
    converted = converted.replace(bulletListRegex, '<ul><li>$1</li></ul>');

    // Ensure the first and last paragraphs are wrapped in <p> tags
    converted = `<p>${converted}</p>`;

    return converted;
  };

  return convertMarkdown;
};
