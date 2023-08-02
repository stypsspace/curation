import { Redis } from '@upstash/redis';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { slug } = req.body; // Use 'slug' instead of 'query'

    const redis = new Redis({
      url: 'https://sound-phoenix-37251.upstash.io', // Replace with your Upstash host URL
      token: 'AZGDACQgMjYyZWZmNTQtNGE1OS00Nzg2LWE5ODItNjVkMmVkZWUwZGRiZWE5NmNiYjkzMThhNDQzZGIxMmU5MzE1ZWFmMWEzNzk=', // Replace with your Upstash token
    });

    try {
      console.log('Fetching page views for slug:', slug); // Add this line
      const result = await redis.get(`pageviews:${slug}`); // Fetch the page view count for the specified slug
      console.log('Fetched page views:', result); // Add this line
      await redis.disconnect(); // Disconnect from the Redis instance
      
      return res.status(200).json({ success: true, result }); // Send the fetched count in the response
    } catch (error) {
      console.error('Error fetching view count:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
};
