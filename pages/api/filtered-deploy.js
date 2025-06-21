export default async function handler(req, res) {
  const { model } = req.body;

  const deployableCollections = ['blog-evergreens', 'inventories'];

  if (!deployableCollections.includes(model)) {
    return res.status(200).json({ message: 'Skipped' });
  }

  // Trigger actual Vercel deploy
  await fetch(process.env.VERCEL_DEPLOY_HOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
  });

  res.status(200).json({ message: 'Deploy triggered' });
}
