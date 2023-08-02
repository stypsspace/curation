import { Redis } from '@upstash/redis';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { slug } = req.query;

    const redis = new Redis({
      url: 'https://sound-phoenix-37251.upstash.io', // Replace with your Upstash host URL
      token: 'AZGDACQgMjYyZWZmNTQtNGE1OS00Nzg2LWE5ODItNjVkMmVkZWUwZGRiZWE5NmNiYjkzMThhNDQzZGIxMmU5MzE1ZWFmMWEzNzk=', // Replace with your Upstash token
    });

    try {
      await redis.incr(slug); // Increment the page view count for the specified slug
      await redis.disconnect(); // Disconnect from the Redis instance
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error incrementing view count:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
};
