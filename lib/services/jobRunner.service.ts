import cron from 'node-cron';

import {
  CRON_OPTIONS,
  CRON_SCHEDULES,
} from '../constants/cronSchedules.constants';
import { getTradingGroupChatInstance } from './tradingGroupChat.service';
import { chatWithDeepSeek } from './puppeteer.service';
import {
  NEW_DAY_OUTLOOK,
  END_OF_DAY_SUMMARY,
  END_OF_WEEK_SUMMARY,
  NEW_WEEK_OUTLOOK,
  INTRADAY_UPDATES,
  DAILY_WEATHER_FORECAST,
} from '../constants/instructions.constants';
import { sendMessageToContact } from './whatsApp.service';

const runTasks = async (tradingGroupChat: any) => {
  const instructionsToRun = [DAILY_WEATHER_FORECAST];

  instructionsToRun.forEach((instruction, index) => {
    setTimeout(async () => {
      console.log('Running instruction:', instruction);
      const modelResponse = await chatWithDeepSeek(instruction);
      // tradingGroupChat?.sendMessage(modelResponse!);
      sendMessageToContact(process.env.MICHAEL_PHONE_NUMBER!, modelResponse!);
    }, 60 * 1000 * index);
  });
};

export const initJobRunner = async () => {
  const tradingGroupChat = getTradingGroupChatInstance();

  cron.schedule(
    CRON_SCHEDULES.INTRADAY_UPDATES,
    async () => {
      const modelResponse = await chatWithDeepSeek(INTRADAY_UPDATES);
      tradingGroupChat?.sendMessage(modelResponse!);
    },
    CRON_OPTIONS
  );

  cron.schedule(
    CRON_SCHEDULES.NEW_DAY_OUTLOOK,
    async () => {
      const modelResponse = await chatWithDeepSeek(NEW_DAY_OUTLOOK);
      tradingGroupChat?.sendMessage(modelResponse!);
    },
    CRON_OPTIONS
  );

  cron.schedule(
    CRON_SCHEDULES.END_OF_DAY_SUMMARY,
    async () => {
      const modelResponse = await chatWithDeepSeek(END_OF_DAY_SUMMARY);
      tradingGroupChat?.sendMessage(modelResponse!);
    },
    CRON_OPTIONS
  );

  cron.schedule(
    CRON_SCHEDULES.NEW_WEEK_OUTLOOK,
    async () => {
      const modelResponse = await chatWithDeepSeek(NEW_WEEK_OUTLOOK);
      tradingGroupChat?.sendMessage(modelResponse!);
    },
    CRON_OPTIONS
  );

  cron.schedule(
    CRON_SCHEDULES.END_OF_WEEK_SUMMARY,
    async () => {
      const modelResponse = await chatWithDeepSeek(END_OF_WEEK_SUMMARY);
      tradingGroupChat?.sendMessage(modelResponse!);
    },
    CRON_OPTIONS
  );

  cron.schedule(
    CRON_SCHEDULES.DAILY_WEATHER_FORECAST,
    async () => {
      const modelResponse = await chatWithDeepSeek(DAILY_WEATHER_FORECAST);
      sendMessageToContact(process.env.MICHAEL_PHONE_NUMBER!, modelResponse!);
    },
    CRON_OPTIONS
  );

  console.log('Job runner initialized');
  // runTasks(tradingGroupChat);
  return Promise.resolve();
};
