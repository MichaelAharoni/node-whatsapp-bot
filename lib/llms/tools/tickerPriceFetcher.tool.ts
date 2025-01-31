import { DynamicStructuredTool } from '@langchain/core/tools';
import { tickerPriceFetcherSchema } from './schemas/tickerPriceFetcher.schema';
import {
  TOOL_DESCRIPTION,
  TOOL_NAME,
} from '../constants/tickerPriceFetcher.constant';
import { tickerPriceFetcherFunction } from '../functions/tickerPriceFetcher.function';

export const tickerPriceFetcherTool = new DynamicStructuredTool({
  name: TOOL_NAME,
  description: TOOL_DESCRIPTION,
  schema: tickerPriceFetcherSchema,
  func: tickerPriceFetcherFunction,
});
