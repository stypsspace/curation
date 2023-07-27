import { generateThumbnail } from 'video-thumbnail';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { videoUrl } = req.body;

  try {
    const thumbnail = await generateThumbnail(videoUrl, { width: 400, height: 300 });
    return res.status(200).json({ thumbnail });
  } catch (error) {
    console.error('Error generating video thumbnail:', error);
    return res.status(500).json({ error: 'Error generating video thumbnail' });
  }
}
