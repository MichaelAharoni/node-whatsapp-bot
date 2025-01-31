import z from 'zod';
import {
  // CURRENT_TIME,
  EXCHANGE_OPTIONS,
  IS_NEED_TO_SEARCH_IN_WEB_DESCRIPTION,
  SCHEMA_DESCRIPTION,
  // SPECIFIC_TIME,
  TICKER_DESCRIPTION,
  TICKERS_DESCRIPTION,
  INCLUDE_PRE_POST_DESCRIPTION,
  INTERVAL_DESCRIPTION,
  RANGE_DESCRIPTION,
} from '../../constants/tickerPriceFetcher.constant';

export const tickerPriceFetcherSchema = z
  .object({
    tickers: z
      .array(
        z.object({
          ticker: z.string().describe(TICKER_DESCRIPTION),
          exchange: z.enum([EXCHANGE_OPTIONS.STOCK, EXCHANGE_OPTIONS.CRYPTO]),
          includePrePost: z
            .boolean()
            .optional()
            .describe(INCLUDE_PRE_POST_DESCRIPTION),
          interval: z.string().optional().describe(INTERVAL_DESCRIPTION),
          range: z.string().optional().describe(RANGE_DESCRIPTION),
          // TODO-make it know the current time !
          // timeFrame: z.union([
          //   z.literal(CURRENT_TIME),
          //   z.string().describe(SPECIFIC_TIME),
          // ]),
          isNeedToSearchInWeb: z
            .boolean()
            .describe(IS_NEED_TO_SEARCH_IN_WEB_DESCRIPTION),
        })
      )
      .describe(TICKERS_DESCRIPTION),
  })
  .describe(SCHEMA_DESCRIPTION);

export type TickerPriceFetcherSchema = z.infer<typeof tickerPriceFetcherSchema>;
