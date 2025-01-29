import { REST_METHODS } from '../../constants/common.constants';

process.env.LIVE_COIN_API_KEY = '6b487e6d-b492-43f7-8b82-c7d8b4f43d5f';

const BASE_LIVE_COIN_URL = 'https://api.livecoinwatch.com';
const LIVE_COIN_CRTPYO_PATH = '/coins/map';
const LIVE_COIN_STOCK_PATH = '/stocks/map';

const YAHOO_FINCENCE_URL =
  'https://query1.finance.yahoo.com/v7/finance/chart/QQQ?interval=1m&includePrePost=true';

const getLiveCoinBody = (tickers: string[]) =>
  JSON.stringify({
    codes: tickers,
    currency: 'USD',
    sort: 'rank',
    order: 'ascending',
    offset: 0,
    limit: 0,
    meta: false,
  });

const getLiveCoinHeaders = () =>
  new Headers({
    'x-api-key': process.env.LIVE_COIN_API_KEY || '',
    'content-type': 'application/json',
  });

interface LIVE_COIN_PRICE {
  code: string;
  cap: number;
  rate: number;
  volume: number;
}

const fetchCoinsPrices = async (
  tickers: string[]
): Promise<LIVE_COIN_PRICE[]> => {
  const url = `${BASE_LIVE_COIN_URL}${LIVE_COIN_CRTPYO_PATH}`;
  const body = getLiveCoinBody(tickers);
  const headers = getLiveCoinHeaders();

  const response = await fetch(url, {
    body,
    headers,
    method: REST_METHODS.POST,
  });
  const priceResponse: LIVE_COIN_PRICE[] = await response.json();
  return priceResponse;
};

export const getCurrentCoinsPrice = async (
  tickers: string[]
): Promise<string> => {
  const unknownTickersPrices: string[] = [];
  const pricesStrings: string[] = [];
  const priceResponse = await fetchCoinsPrices(tickers);

  priceResponse.forEach(({ code, rate }) => {
    const priceString = rate && `The price of ${code} coin is ${rate}.`;

    if (priceString) {
      pricesStrings.push(priceString);
    } else {
      unknownTickersPrices.push(code);
    }
  });

  const pricesResult = pricesStrings.join(', ');
  return pricesResult;
};

export const tickerPriceFetcherFunction = async (data: any) => {
  console.log('data', data);
};
