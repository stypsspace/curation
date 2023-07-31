import { ReportView } from "./view";

type Props = {
    params: {
      slug: string;
    };
  };
  
  export const revalidate = 60; // Revalidation interval in seconds
  
  export default function Page({ params }: Props) {
    const views = await redis.get<number>(["pageviews", "projects", params.slug].join(":")) ?? 0;
    
    return (
      <div>
        <ReportView slug={params.slug} />
        {/* Add your page content here */}
      </div>
    );
  }

 