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

// Function to create a new "Advert" entry with a timestamp
export async function createAdvertWithTimestamp(title, category, otherFields) {
  try {
    const currentTimestamp = new Date().toISOString();
    const newAdvertEntry = await client.createEntry('advert', {
      fields: {
        title,
        category, // Set the category field for "Advert" entries
        timestamp: currentTimestamp,
        ...otherFields,
      },
    });

    console.log('New Advert Entry:', newAdvertEntry);
    return newAdvertEntry;
  } catch (error) {
    console.error('Error creating Advert:', error);
    return null; // Return null in case of an error
  }
}

export default client;
