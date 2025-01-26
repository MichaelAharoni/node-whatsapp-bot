export const CRON_SCHEDULES = {
  INTRADAY_UPDATES: '*/30 16-23 * * 1-5',
  NEW_DAY_OUTLOOK: '20 16 * * 1-5',
  END_OF_DAY_SUMMARY: '30 23 * * 1-5',
  END_OF_WEEK_SUMMARY: '30 17 * * 5',
  NEW_WEEK_OUTLOOK: '00 15 * * 1',

  DAILY_WEATHER_FORECAST: '00 05 * * 0,2,3',
};

export const CRON_OPTIONS = {
  scheduled: true,
  timezone: 'Asia/Jerusalem',
};
