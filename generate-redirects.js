const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const projectRoot = process.cwd();

async function fetchAllRedirects() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:1337';
  let currentPage = 1;
  let allRedirects = [];
  let hasMorePages = true;

  try {
    while (hasMorePages) {
      const url = `${apiUrl}/api/redirects?pagination[page]=${currentPage}&pagination[pageSize]=100`;

      try {
        const response = await fetch(url, { timeout: 5000 }); // Add timeout to prevent long waits

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
        console.warn(
          `⚠️ Error fetching page ${currentPage} of redirects:`,
          error.message
        );
        hasMorePages = false; // Stop trying on error
      }
    }
  } catch (error) {
    console.warn('⚠️ Could not fetch redirects from API:', error.message);
  }

  return allRedirects;
}

async function generateRedirectsFile() {
  try {
    let redirects = [];

    try {
      redirects = await fetchAllRedirects();
    } catch (error) {
      console.warn(
        '⚠️ Error fetching redirects, using empty array as fallback'
      );
    }

    // If we have a previous redirects file and no new redirects were fetched,
    // try to use the existing file data as fallback
    if (redirects.length === 0) {
      const filePath = path.join(projectRoot, 'redirectUrls.ts');
      if (fs.existsSync(filePath)) {
        try {
          console.log(
            'ℹ️ No redirects fetched from API, using existing redirectUrls.ts as fallback'
          );
          // We're not loading the file here, just keeping the previous one
          return; // Exit without overwriting the file
        } catch (readError) {
          console.warn(
            '⚠️ Could not read existing redirects file, using empty array'
          );
        }
      } else {
        console.log(
          'ℹ️ No redirects fetched and no existing file, creating empty redirects file'
        );
      }
    }

    // Generate the TypeScript content
    const fileContent = `// THIS FILE IS AUTO-GENERATED - DO NOT EDIT
// Generated on: ${new Date().toISOString()}

export const redirectUrls: [string, string][] = ${JSON.stringify(redirects, null, 2)};`;

    // Write to file in project root
    const filePath = path.join(projectRoot, 'redirectUrls.ts');

    fs.writeFileSync(filePath, fileContent);
    console.log(
      `✅ Successfully generated redirects file with ${redirects.length} entries`
    );
  } catch (error) {
    console.error('⚠️ Error generating redirects file:', error.message);

    // Create empty redirects file as fallback instead of exiting
    const filePath = path.join(projectRoot, 'redirectUrls.ts');
    const fallbackContent = `// THIS FILE IS AUTO-GENERATED - DO NOT EDIT
// Generated on: ${new Date().toISOString()}
// NOTICE: Generated as fallback due to API connection error

export const redirectUrls: [string, string][] = [];`;

    try {
      fs.writeFileSync(filePath, fallbackContent);
      console.log('ℹ️ Created fallback empty redirects file');
    } catch (writeError) {
      console.error(
        '❌ Critical error: Could not create fallback redirects file:',
        writeError.message
      );
      process.exit(1); // Only exit if we absolutely cannot create the file
    }
  }
}

generateRedirectsFile();
