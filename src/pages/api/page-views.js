import { google } from 'googleapis';

export default async (req, res) => {
  const startDate = req.query.startDate || '2020-01-01';
  const slug = req.query.slug;

  try {
    const analytics = google.analytics({
      auth,
      version: 'v4',
    });

    const response = await analytics.data.ga.get({
      'end-date': 'today',
      ids: `ga:${process.env.GOOGLE_ANALYTICS_VIEW_ID}`,
      metrics: 'ga:pageviews',
      dimensions: 'ga:pagePath',
      filters: `ga:pagePath==${slug}`,
      'start-date': startDate,
    });

    const pageViews = response?.data?.totalsForAllResults['ga:pageviews'];

    return res.status(200).json({
      pageViews,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}