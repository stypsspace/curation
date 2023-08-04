import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = new Redis({
	url: 'https://suitable-bull-37897.upstash.io',
	token: 'AZQJACQgODYyNGJmODAtODVmZi00Y2YyLThlNTUtNWZmZDAyZDdmMGZlNjA1ZTViYzYzNWQzNDBmM2I4MzNjODMyODliYjMzZDY=',
});

export const config = {
  runtime: "edge",
};

export default async function incr(req: NextRequest): Promise<NextResponse> {
  console.log('API Request Data:', req.body);
    
  if (req.method !== "POST") {
    return new NextResponse("use POST", { status: 405 });
  }
  if (req.headers.get("Content-Type") !== "application/json") {
    return new NextResponse("must be json", { status: 400 });
  }

  const body = await req.json();
  let slug: string | undefined = undefined;
  if ("slug" in body) {
    slug = body.slug;
  }
  if (!slug) {
    return new NextResponse("Slug not found", { status: 400 });
  }
  
  const ip = req.ip;
  if (ip) {
    // Hash the IP in order to not store it directly in your db.
    const buf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(ip),
    );
    const hash = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const deduplicationKey = ["deduplicate", hash, slug].join(":");
    const isNew = await redis.set(deduplicationKey, true, {
      nx: true,
      ex: 24 * 60 * 60,
    });

    console.log('isNew:', isNew);
    console.log('deduplication key:', deduplicationKey);

    if (!isNew) {
      console.log('Page view was not incremented.');
      return new NextResponse(null, { status: 202 });
    }
  }

  await redis.incr(["pageviews", "projects", slug].join(":"));
  console.log('Page view incremented successfully');
  return new NextResponse(null, { status: 202 });
}
