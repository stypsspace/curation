import { useState, useEffect } from "react";
import { ReportView } from "./view";

type Props = {
  params: {
    slug: string;
  };
};

export const revalidate = 60; // Revalidation interval in seconds

export default function Page({ params }: Props) {
  const [views, setViews] = useState<number>(0);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const response = await fetch(`/api/views?slug=${params.slug}`);
        if (response.ok) {
          const data = await response.json();
          setViews(data.viewCount);
        } else {
          console.error("Error fetching views.");
        }
      } catch (error) {
        console.error("Error fetching views:", error);
      }
    };

    fetchViews();
  }, [params.slug]);

  return (
    <div>
      <ReportView slug={params.slug} />
      <p>Views: {views}</p>
      {/* Add your page content here */}
    </div>
  );
}
