export const SCHEMA_DESCRIPTION =
  'Ticker price fetcher schema, defines the tickers to fetch prices for, with the information needed to fetch the price.';
export const TICKERS_DESCRIPTION =
  'Array of tickers to fetch prices for, a list of ticker objects that need to be fetched';
export const TICKER_DESCRIPTION =
  'The ticker symbol, i.e. "AAPL", "BTC", etc., if you  are not sure about the ticker symbol, type here what you know and we will try to find the correct one for you. (like if the user provided the company name, or any other data, type it within it), if its a crypto currency, suffix it with -USD, for example: "BTC-USD"';
export const IS_NEED_TO_SEARCH_IN_WEB_DESCRIPTION =
  'If the ticker symbol is not known, set this to true, and we will try to find the correct one for you.';
// export const TIME_FRAME_DESCRIPTION =
//   'The time frame to fetch the price for, if you want the current price, set it to "currentPrice", if you want the price at a specific time, set it to the time that the user asked';
export const INCLUDE_PRE_POST_DESCRIPTION =
  'Should include pre and post market data, based on the user question, if the user asked for the price at a specific time, this should be false, if the user asked for the current price or he asks for pre/post price, this should be true (Relevant only for stock exchange)';
export const INTERVAL_DESCRIPTION =
  'The interval of the data, if the user asked for specific time like hours, try to be accurate, otherwise by default, set to "1d"';
export const RANGE_DESCRIPTION =
  'The range of the data, if the user asked for historical data, set the range here, for example: "1m", "1h", "1d", "10d" etc. can be relevant if the user asks for some indicators like moving average, etc or even comparing a ticker to itself in a different time, . by default, set to "1d"';
// export const CURRENT_TIME = 'currentPrice';
// export const SPECIFIC_TIME =
//   'If you understood the the price is related to a specific time, please provide the time here, for example: "3 hours ago", "Yesterday", "At Monday 10:00", "Last year", "15/02/2024" etc.';

export const TOOL_NAME = 'ticker-price-fetcher';
export const TOOL_DESCRIPTION =
  'Tool to fetch current and historical prices of tickers symbols from a stock or crypto exchange. use this tool to get the current price of a ticker symbol or the price at a specific time. you can use this tool even if you dont sure what the ticker symbol is, just provide the information you know and we will try to find the correct one for you.';

export const EXCHANGE_OPTIONS = {
  STOCK: 'stock',
  CRYPTO: 'crypto',
};

export const INTERVAL_OPTIONS = {
  ONE_MINUTE: '1m',
  FIVE_MINUTES: '5m',
  FIFTEEN_MINUTES: '15m',
  THIRTY_MINUTES: '30m',
  ONE_HOUR: '1h',
  FOUR_HOURS: '4h',
  ONE_DAY: '1d',
  SEVEN_DAYS: '7d',
  FOURTEEN_DAYS: '14d',
  ONE_MONTH: '1M',
};
