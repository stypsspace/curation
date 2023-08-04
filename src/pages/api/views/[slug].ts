// src/pages/api/views/[slug].ts
import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const slug = req.query.slug as string;
    
    if (req.method === "PATCH") {
      // Increment the page view count in Redis
      const viewCount = await redis.incr(`views:${slug}`);
      
      // Revalidate the associated page for ISR
      res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
      return res.status(200).json({ views: viewCount });
    } else {
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error updating page views:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
