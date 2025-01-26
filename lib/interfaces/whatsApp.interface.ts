import { CHAT_TYPE } from '../constants/whatsApp.constants';
import { TradingGroupChat } from '../classes/tradingGroup.class';

export interface TradingGroupI {
  chat: TradingGroupChat | null;
  isInitialized: boolean;
}

export type ChatType = typeof CHAT_TYPE.GROUP | typeof CHAT_TYPE.CONTACT;
