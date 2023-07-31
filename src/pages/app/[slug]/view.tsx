import { useEffect } from "react";

// Define the ReportView component
export const ReportView: React.FC<{ slug: string }> = ({ slug }) => {
  useEffect(() => {
    // Call the function to send a POST request to the API route
    const sendIncrementRequest = async () => {
      try {
        const response = await fetch("/api/incr", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slug }),
        });

        if (!response.ok) {
          console.error("Error incrementing view count.");
        }
      } catch (error) {
        console.error("Error sending increment request:", error);
      }
    };

    // Call the function to send the POST request when the component mounts
    sendIncrementRequest();
  }, [slug]);

  return null;
};
