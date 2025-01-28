const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const projectRoot = process.cwd();

async function fetchAllRedirects() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:1337';
  let currentPage = 1;
  let allRedirects = [];
  let hasMorePages = true;

  while (hasMorePages) {
    const url = `${apiUrl}/api/redirects?pagination[page]=${currentPage}&pagination[pageSize]=100`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        hasMorePages = false;
        continue;
      }

      // Transform the data to the required format with validation
      const transformedRedirects = data.data
        .map((item) => {
          if (!item?.attributes) {
            return null;
          }

          const { from, to } = item.attributes;

          if (!from || !to) {
            return null;
          }

          return [from, to];
        })
        .filter((item) => item !== null); // Remove any invalid entries

      allRedirects = [...allRedirects, ...transformedRedirects];

      // Check if there are more pages
      const { pagination } = data.meta;
      hasMorePages = pagination.page < pagination.pageCount;
      currentPage++;
    } catch (error) {
      console.error('❌ Error fetching redirects:', error);
      process.exit(1);
    }
  }

  if (allRedirects.length === 0) {
    console.error(
      '⚠️ No valid redirects found! This might indicate a problem with the data structure or API response.'
    );
    process.exit(1);
  }

  return allRedirects;
}

async function generateRedirectsFile() {
  try {
    const redirects = await fetchAllRedirects();

    // Generate the TypeScript content
    const fileContent = `// THIS FILE IS AUTO-GENERATED - DO NOT EDIT
    // Generated on: ${new Date().toISOString()}

    export const redirectUrls: [string, string][] = ${JSON.stringify(redirects, null, 2)};`;

    // Write to file in project root
    const filePath = path.join(projectRoot, 'redirectUrls.ts');

    fs.writeFileSync(filePath, fileContent);
  } catch (error) {
    console.error('❌ Error generating redirects file:', error);
    process.exit(1);
  }
}

generateRedirectsFile();
