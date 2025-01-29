import z from 'zod';
import {
  CURRENT_TIME,
  EXCHANGE_OPTIONS,
  IS_NEED_TO_SEARCH_IN_WEB_DESCRIPTION,
  SCHEMA_DESCRIPTION,
  SPECIFIC_TIME,
  TICKER_DESCRIPTION,
  TICKERS_DESCRIPTION,
  TIME_FRAME_DESCRIPTION,
} from '../../constants/tickerPriceFetcher.constant';

export const tickerPriceFetcherSchema = z
  .object({
    tickers: z
      .array(
        z.object({
          ticker: z.string().describe(TICKER_DESCRIPTION),
          exchange: z.enum([EXCHANGE_OPTIONS.STOCK, EXCHANGE_OPTIONS.CRYPTO]),
          timeFrame: z
            .union([
              // z.literal(CURRENT_TIME),
              z.string().describe(CURRENT_TIME),
              z.string().describe(SPECIFIC_TIME),
            ])
            .describe(TIME_FRAME_DESCRIPTION),
          isNeedToSearchInWeb: z
            .boolean()
            .describe(IS_NEED_TO_SEARCH_IN_WEB_DESCRIPTION),
        })
      )
      .describe(TICKERS_DESCRIPTION),
  })
  .describe(SCHEMA_DESCRIPTION);
