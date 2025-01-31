import { resolveAfterTimeout } from '../utils/puppeteer.utils';
import { Page } from 'puppeteer';
import {
  EMAIL_INPUT_SELECTOR,
  PASSWORD_INPUT_SELECTOR,
  CHECKBOX_SELECTOR,
  SIGN_IN_BUTTON_SELECTOR,
  SEARCH_BUTTON_SELECTOR,
  SEARCH_INPUT_SELECTOR,
  RESPONSE_SELECTOR,
  CONVERSATION_LIST_SELECTOR,
  LINKS_SELECTOR,
} from '../constants/puppeteer.constants';
import {
  FIVE_SECONDS,
  HALF_A_SECOND,
  HALF_AN_HOUR,
} from '../constants/timeInMs.constants';
import puppeteer from 'puppeteer';
import {
  waitForCompletion,
  waitUntilParentChildCountIncreased,
} from '../utils/puppeteer.utils';
import { setEnvVariables } from './awsParemeterStore.service';
import { FULL_INSTRUCTIONS } from '../constants/instructions.constants';

const puppeteerState: {
  pageInstance: Page;
  browserInstance: any;
  isInitialized: boolean;
  closeBrowserTimeoutId: NodeJS.Timeout;
} = {
  pageInstance: null!,
  browserInstance: null,
  isInitialized: false,
  closeBrowserTimeoutId: null!,
};

export const closeBrowser = async () => {
  await puppeteerState.browserInstance.close();
  puppeteerState.pageInstance = null!;
  puppeteerState.browserInstance = null!;
};

const closeBrowserAfterTimeout = () => {
  if (puppeteerState.closeBrowserTimeoutId) {
    clearTimeout(puppeteerState.closeBrowserTimeoutId);
  }
  puppeteerState.closeBrowserTimeoutId = setTimeout(async () => {
    await closeBrowser();
  }, HALF_AN_HOUR);
};

export const initPuppeteerPage = async () => {
  if (puppeteerState.pageInstance) return;
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=800,600',
    ],
  });
  const page: Page = await browser.newPage();
  await page.goto('https://chat.deepseek.com/', {
    waitUntil: 'networkidle2',
  });

  // Authenticate
  console.log('Authenticating...');
  await page.waitForSelector(EMAIL_INPUT_SELECTOR);
  await page.type(EMAIL_INPUT_SELECTOR, process.env.USER_EMAIL!);
  await page.type(PASSWORD_INPUT_SELECTOR, process.env.DEEPSEEK_PASSWORD!);
  await page.click(CHECKBOX_SELECTOR);
  await page.click(SIGN_IN_BUTTON_SELECTOR);

  // Setting up last conversation
  console.log('Setting up last conversation...');
  await page.waitForSelector(SEARCH_INPUT_SELECTOR);
  await page.click(SEARCH_INPUT_SELECTOR);
  await resolveAfterTimeout(HALF_A_SECOND);
  await page.click(SEARCH_BUTTON_SELECTOR);
  await page.type(SEARCH_INPUT_SELECTOR, FULL_INSTRUCTIONS);
  await page.keyboard.press('Enter');

  puppeteerState.pageInstance = page;
  puppeteerState.browserInstance = browser;
  await puppeteerState.pageInstance.waitForSelector(CONVERSATION_LIST_SELECTOR);
  await resolveAfterTimeout(FIVE_SECONDS);

  puppeteerState.isInitialized = true;
  return;
};

export async function chatWithDeepSeek(baseMessage: string) {
  const messageWithInstructions = ` ${baseMessage} (תבדוק באינטרנט אם צריך)`;
  const message = messageWithInstructions.replace('טרדר', '');
  closeBrowserAfterTimeout();

  try {
    await initPuppeteerPage();
    await puppeteerState.pageInstance.type(SEARCH_INPUT_SELECTOR, message);
    await puppeteerState.pageInstance.keyboard.press('Enter');
    await puppeteerState.pageInstance.waitForSelector(
      CONVERSATION_LIST_SELECTOR
    );
    const responseParentElement = await puppeteerState.pageInstance.$(
      CONVERSATION_LIST_SELECTOR
    );
    await waitUntilParentChildCountIncreased(responseParentElement!, 2);
    const lastChild = (await responseParentElement?.$$(':scope > *'))?.pop();
    await waitForCompletion(lastChild!);
    const linksElements = await puppeteerState.pageInstance.$$(LINKS_SELECTOR);
    for (const linkElement of linksElements) {
      await puppeteerState.pageInstance.evaluate(
        el => el.remove(),
        linkElement
      );
    }
    const elementsText = await puppeteerState.pageInstance.evaluate(
      selector => {
        const elementsNodeList = document.querySelectorAll(selector);
        return Array.from(elementsNodeList).map(el => el.textContent);
      },
      RESPONSE_SELECTOR
    );

    const response = elementsText.pop();

    return response;
  } catch (error) {
    console.error('Error during interaction:', error);
    throw error;
  }
}

export const testResponse = async (message: string) => {
  const response = await chatWithDeepSeek(message);
  console.log('Response:', response);
};

export const getIsPuppeteerInitialized = () => puppeteerState.isInitialized;

// setEnvVariables().then(() => {
//   testResponse('מה תחזית מזג האוויר לשבוע הקרוב בקריות ?');
// });
