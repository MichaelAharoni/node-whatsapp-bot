import { Chat, Client, Message } from 'whatsapp-web.js';
import {
  WA_GROUP_SUFFIX,
  WA_CONTACT_SUFFIX,
  CHAT_TYPE_TO_SUFFIX_MAP,
  CHAT_TYPE,
} from '../constants/whatsApp.constants';
import { ChatType } from '../interfaces/whatsApp.interface';
import { getPhoneNumbersENV } from '../services/envVariables.service';
import { NAMES } from '../constants/userNames.constants';
import { TradingGroupChat } from '../classes/tradingGroup.class';

const getPhoneNumbersWithUserSuffix = () => {
  const phoneNumbersENV = getPhoneNumbersENV();

  return Object.values(phoneNumbersENV)
    .filter((number) => number !== phoneNumbersENV.TREDER_PHONE_NUMBER)
    .map((phoneNumber) => `${phoneNumber}${WA_CONTACT_SUFFIX}`);
};

export const getIsMessageFromGroup = (message: Message) => {
  return message.from.includes(WA_GROUP_SUFFIX);
};

export const getChatIdWithSuffix = (chatId: string, chatType: ChatType) => {
  const suffix = CHAT_TYPE_TO_SUFFIX_MAP[chatType];
  return `${chatId}${suffix}`;
};

export const getIsTradingGroupChat = (message: Message) => {
  const currentChatId = message.id.remote;
  const tradingGroupChatId = getChatIdWithSuffix(
    process.env.TRADING_GROUP_ID!,
    CHAT_TYPE.GROUP
  );
  const isTradingGroupChat = currentChatId === tradingGroupChatId;

  return isTradingGroupChat;
};

export const sendMessageByInstance = async (
  instance: Chat | TradingGroupChat,
  message: string
) => {
  const formattedMessage = formatMessage(message);
  return instance.sendMessage(formattedMessage);
};

export const getIsKnownUser = (message: Message) => {
  const phoneNumbersWithUserSuffix = getPhoneNumbersWithUserSuffix();
  return phoneNumbersWithUserSuffix.includes(message.from);
};

export const getIsDirectedToAnotherUser = (message: Message) => {
  const phoneNumbersENV = getPhoneNumbersENV();
  const isMessageContainUserName = Object.values(NAMES).some((name) =>
    message.body.toLowerCase().includes(name.toLocaleLowerCase())
  );
  if (isMessageContainUserName) return true;

  const regex = /@972\d{9}/;
  const isMentionedUser = regex.test(message.body);

  if (isMentionedUser) {
    const isMentionedBot = message.body.includes(
      `@${phoneNumbersENV.TREDER_PHONE_NUMBER}`
    );
    return !isMentionedBot;
  }
};

export const sendMessageToContactByClient = async (
  client: Client,
  number: string,
  message: string
) => {
  const chatId = `${number}${WA_CONTACT_SUFFIX}`;
  const finalMessage = `\u200F${message}`;
  const chat = await client.getChatById(chatId);
  await sendMessageByInstance(chat, finalMessage);
};

export const sendMessageToGroup = async (
  client: Client,
  groupId: string,
  message: string
) => {
  const chatId = `${groupId}${WA_GROUP_SUFFIX}`;
  const chat = await client.getChatById(chatId);

  await sendMessageByInstance(chat, message);
};

const formatMessage = (input: string) => {
  let formattedMessage = input.replace(/\n/g, '\n\n');
  formattedMessage = formattedMessage.replace(/:\s/g, ':\n');
  formattedMessage = formattedMessage.replace(/\.\s/g, '.\n');

  const rtlMessage = `\u200F${formattedMessage}`;

  return `\u200F${rtlMessage}`;
};
