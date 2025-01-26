import { Client } from 'whatsapp-web.js';

import { TradingGroupChat } from '../classes/tradingGroup.class';

let tradingGroupChatInstance: TradingGroupChat;

export const getTradingGroupChatInstance = (client?: Client) => {
  if (tradingGroupChatInstance) {
    return tradingGroupChatInstance;
  } else if (client) {
    tradingGroupChatInstance = new TradingGroupChat(client);
    return tradingGroupChatInstance;
  }
};
