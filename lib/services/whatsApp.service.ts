import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

import {
  getIsKnownUser,
  getIsTradingGroupChat,
  getIsDirectedToAnotherUser,
  sendMessageToContactByClient,
  sendMessageByInstance,
} from '../utils/whatsApp.utils';
import { getTradingGroupChatInstance } from './tradingGroupChat.service';
import {
  chatWithDeepSeek,
  getIsPuppeteerInitialized,
} from './puppeteer.service';
import { getPhoneNumbersENV } from './envVariables.service';
import { chatWithGPT } from './puppeteer-gpt.service';
import { HALF_A_SECOND } from '../constants/timeInMs.constants';

const whatsAppState: { client: Client; isInitialized: boolean } = {
  client: null!,
  isInitialized: false,
};

export const waitUntilClientIsInitialized = async () => {
  while (!whatsAppState.isInitialized) {
    await new Promise(resolve => setTimeout(resolve, HALF_A_SECOND));
  }
};

export const initClient = async () => {
  console.log('Initializing client...');

  const { TREDER_PHONE_NUMBER } = getPhoneNumbersENV();

  const client = new Client({
    authStrategy: new LocalAuth({
      clientId: `${TREDER_PHONE_NUMBER}`,
    }),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=800,600',
      ],
    },
  });

  client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', async () => {
    whatsAppState.isInitialized = true;
    whatsAppState.client = client;
    const tradingGroup = getTradingGroupChatInstance(client);
    await tradingGroup?.waitForInitialization();
    console.log('Client is ready!');
  });

  client.on('message', async (message: Message) => {
    try {
      const isPuppeteerInitialized = getIsPuppeteerInitialized();
      if (!isPuppeteerInitialized) {
        console.log('Puppeteer is not initialized, ignoring message...');
        return;
      }
      const isTradingGroupChat = getIsTradingGroupChat(message);
      if (isTradingGroupChat) {
        const isDirectedToAnotherUser = getIsDirectedToAnotherUser(message);
        console.log('Received message in trading group:');
        if (isDirectedToAnotherUser) {
          console.log('Message is directed to another user, ignoring...');
          return;
        }
        const tradingGroup = getTradingGroupChatInstance(client);
        await tradingGroup?.simulateTyping();
        const messageToSend = await chatWithDeepSeek(message.body);
        // const messageToSend = await chatWithGPT(message.body);
        await tradingGroup?.sendMessage(messageToSend!);
      } else {
        console.log('Received message in private chat:', message.body);
        const isKnownUser = getIsKnownUser(message);
        if (isKnownUser) {
          const chat = await message.getChat();
          await chat.sendStateTyping();
          const messageToSend = await chatWithDeepSeek(message.body);
          // const messageToSend = await chatWithGPT(message.body);
          await sendMessageByInstance(chat, messageToSend!);
        }
      }
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });

  try {
    await client.initialize();
    await waitUntilClientIsInitialized();
  } catch (err) {
    console.log('Error initializing client:', err);
    console.error('Error initializing client:', err);
    throw err;
  }
  console.log('Client initialized!');
};

export const sendMessageToContact = async (number: string, message: string) => {
  return sendMessageToContactByClient(whatsAppState.client, number, message);
};

export const sendMessagesWhenReady = async () => {
  const tradingGroup = getTradingGroupChatInstance(whatsAppState.client);
  await tradingGroup?.waitForInitialization();
  await sendMessageToContact(
    process.env.MICHAEL_PHONE_NUMBER!,
    'חזרתי לשירות !'
  );
};
