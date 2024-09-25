import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(sitemapContent);
  } catch (error) {
    // console.error('Error serving sitemap:', error);
    res.status(500).send('Error serving sitemap');
  }
}
