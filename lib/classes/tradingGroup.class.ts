import { Chat, Client } from 'whatsapp-web.js';
import { CHAT_TYPE } from '../constants/whatsApp.constants';
import {
  getChatIdWithSuffix,
  sendMessageByInstance,
} from '../utils/whatsApp.utils';
import { A_MINUTE, HALF_A_SECOND } from '../constants/timeInMs.constants';

export class TradingGroupChat {
  private chat!: Chat;
  constructor(private client: Client) {
    this.initialize();
  }

  private async initialize() {
    const chatId = getChatIdWithSuffix(
      process.env.TRADING_GROUP_ID!,
      CHAT_TYPE.GROUP
    );
    const chat = await this.client.getChatById(chatId);
    this.chat = chat;
  }

  async sendMessage(message: string) {
    await sendMessageByInstance(this.chat, message);
  }

  async simulateTyping(duration: number = A_MINUTE) {
    await this.chat.sendStateTyping();
    setTimeout(async () => {
      await this.chat.clearState();
    }, duration);
  }

  getIsInitialized() {
    return !!this.chat;
  }

  async waitForInitialization() {
    const isInitialized = this.getIsInitialized();
    while (!isInitialized) {
      await new Promise(resolve => setTimeout(resolve, HALF_A_SECOND));
    }
  }
}
