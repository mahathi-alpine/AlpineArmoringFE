export default async function handler(req, res) {
  // if (req.query.secret !== process.env.PREVIEW_SECRET || !req.query.slug) {
  if (req.query.secret !== 'blogPreview' || !req.query.slug) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  res.setPreviewData({});

  const locale = req.query.locale || 'en';
  const blogUrl =
    locale === 'en'
      ? `/blog/${req.query.slug}`
      : `/${locale}/blog/${req.query.slug}`;

  res.redirect(blogUrl);
}
