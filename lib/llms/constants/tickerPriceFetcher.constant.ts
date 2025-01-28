export const SCHEMA_DESCRIPTION =
  'Ticker price fetcher schema, defines the tickers to fetch prices for, with the information needed to fetch the price.';
export const TICKERS_DESCRIPTION =
  'Array of tickers to fetch prices for, a list of ticker objects that need to be fetched';
export const TICKER_DESCRIPTION =
  'The ticker symbol, i.e. "AAPL", "BTC", etc., if you  are not sure about the ticker symbol, type here what you know and we will try to find the correct one for you. (like if the user provided the company name, or any other data, type it within it)';
export const IS_NEED_TO_SEARCH_IN_WEB_DESCRIPTION =
  'If the ticker symbol is not known, set this to true, and we will try to find the correct one for you.';
export const TIME_FRAME_DESCRIPTION =
  'The time frame to fetch the price for, if you want the current price, set it to "currentPrice", if you want the price at a specific time, set it to "specificTime"';

export const CURRENT_TIME = 'currentPrice';
export const SPECIFIC_TIME = 'If you understood the the price is related to a specific time, please provide the time here, for example: "3 hours ago", "Yesterday", "At Monday 10:00", "Last year", "15/02/2024" etc.';

export const TOOL_NAME = 'ticker-price-fetcher';
export const TOOL_DESCRIPTION = 'Tool to fetch the price tickers symbols from a stock or crypto exchange. use this tool to get the current price of a ticker symbol or the price at a specific time.';

export const EXCHANGE_OPTIONS = {
  STOCK: 'stock',
  CRYPTO: 'crypto',
};
