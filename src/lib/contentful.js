import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// Function to fetch "Advert" entries
export async function getAdvertEntries() {
  try {
    const response = await client.getEntries({ content_type: 'advert' });
    return response.items;
  } catch (error) {
    console.error('Error fetching Advert entries:', error);
    return []; // Return an empty array in case of an error
  }
}

export default client;
