import { resolveAfterTimeout } from '../utils/puppeteer.utils';
import { Page } from 'puppeteer';
import {
  EMAIL_INPUT_SELECTOR,
  PASSWORD_INPUT_SELECTOR,
  SEARCH_BUTTON_SELECTOR,
  SEARCH_INPUT_SELECTOR,
  RESPONSE_SELECTOR,
  FULL_INSTRUCTIONS,
  LOGIN_BUTTON_SELECTOR,
  CODE_INPUT_SELECTOR,
  RESULT_STREAMING_SELECTOR,
  RESULT_STREAMING_FINISHED_SELECTOR,
  SEND_BUTTON,
} from '../constants/puppeteer-gpt.constants';
import {
  FIVE_SECONDS,
  HALF_A_SECOND,
  HALF_AN_HOUR,
  HALF_AN_MINUTE,
  TWO_SECONDS,
} from '../constants/timeInMs.constants';
import puppeteer from 'puppeteer';
import { waitUntilImapListenerReady } from './imap.service';
import { setEnvVariables } from './awsParemeterStore.service';

let pageInstance: Page = null!;
let browserInstance: any = null!;
let closeBrowserTimeoutId: NodeJS.Timeout | null = null;

export const getOpenAiCodeFromEnv = async (): Promise<string> => {
  let intervalId: NodeJS.Timeout;
  return new Promise((resolve, reject) => {
    intervalId = setInterval(() => {
      if (process.env.OPENAI_VERIFICATION_CODE) {
        clearInterval(intervalId);
        resolve(process.env.OPENAI_VERIFICATION_CODE);
      }
    }, HALF_A_SECOND);
  });
};

export const closeBrowser = async () => {
  await browserInstance.close();
  pageInstance = null!;
  browserInstance = null!;
};

const closeBrowserAfterTimeout = () => {
  if (closeBrowserTimeoutId) {
    clearTimeout(closeBrowserTimeoutId);
  }
  closeBrowserTimeoutId = setTimeout(async () => {
    await closeBrowser();
  }, HALF_AN_HOUR);
};

export const initPuppeteerPage = async () => {
  if (pageInstance) return;
  console.log('Initiating page...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=800,600',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--disable-site-isolation-trials',
      '--ignore-certificate-errors',
      '--ignore-certificate-errors-spki-list',
      '--ignore-ssl-errors',
      '--ignore-certificate-errors',
      '--disable-infobars',
    ],
  });
  const page: Page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0'
  );
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
  await resolveAfterTimeout(TWO_SECONDS);

  await page.goto('https://chatgpt.com', {
    waitUntil: 'load',
  });

  // Authenticate
  console.log('Authenticating...');
  await page.waitForSelector(LOGIN_BUTTON_SELECTOR);
  await page.click(LOGIN_BUTTON_SELECTOR);
  await resolveAfterTimeout(FIVE_SECONDS);
  // const currentPageUrl = page.url();
  // await page.goto(currentPageUrl, {
  //   waitUntil: 'load',
  // });
  await page.waitForSelector(EMAIL_INPUT_SELECTOR);
  await page.type(EMAIL_INPUT_SELECTOR, process.env.USER_EMAIL!);
  await page.keyboard.press('Enter');
  await page.waitForSelector(PASSWORD_INPUT_SELECTOR);
  await resolveAfterTimeout(TWO_SECONDS);
  await page.type(PASSWORD_INPUT_SELECTOR, process.env.OPENAI_PASSWORD!);
  await resolveAfterTimeout(TWO_SECONDS);
  console.log('before imap !');
  // Fetching the verification code from email
  await waitUntilImapListenerReady();
  console.log('after imap !');
  await page.keyboard.press('Enter');
  const openAiCode = await getOpenAiCodeFromEnv();
  await page.type(CODE_INPUT_SELECTOR, openAiCode);
  await page.keyboard.press('Enter');
  // Setting up the instructions
  await resolveAfterTimeout(TWO_SECONDS);
  console.log('Setting up the instructions...');
  await page.waitForSelector(SEARCH_INPUT_SELECTOR);
  await page.type(SEARCH_INPUT_SELECTOR, FULL_INSTRUCTIONS);
  await resolveAfterTimeout(FIVE_SECONDS);
  // console.log('searching the web button');
  // await page.goto('https://chatgpt.com', {
  //   waitUntil: 'load',
  // });
  await page.waitForSelector(SEARCH_BUTTON_SELECTOR);
  await page.click(SEARCH_BUTTON_SELECTOR);
  await page.click(SEND_BUTTON);
  // await page.keyboard.press('Enter');

  pageInstance = page;
  browserInstance = browser;
  return;
};

export async function chatWithGPT(baseMessage: string) {
  let message = baseMessage.replace('טרדר', '');
  message = baseMessage.replace('טרידר', '');
  message = baseMessage.replace('טריידר', '');
  // closeBrowserAfterTimeout();

  try {
    await initPuppeteerPage();
    console.log('Interacting with GPT...');
    await pageInstance.goto('https://chatgpt.com', {
      waitUntil: 'load',
    });
    await pageInstance.waitForSelector(SEARCH_INPUT_SELECTOR);
    await pageInstance.type(SEARCH_INPUT_SELECTOR, message);
    await pageInstance.keyboard.press('Enter');
    await resolveAfterTimeout(HALF_A_SECOND);
    await pageInstance.waitForSelector(RESULT_STREAMING_SELECTOR);
    await pageInstance.waitForSelector(RESULT_STREAMING_FINISHED_SELECTOR);
    const article = await pageInstance.$(RESPONSE_SELECTOR);
    const paragraphElements = await article?.$$('p');
    const response = await Promise.all(
      paragraphElements!.map(el => {
        return el.evaluate(el => el.textContent);
      })
    );

    return response?.join(',');
  } catch (error) {
    console.error('Error during interaction:', error);
    throw error;
  }
}

export const testResponse = async (message: string) => {
  const response = await chatWithGPT(message);
  console.log('Response:', response);
};

// setEnvVariables().then(() => {
//   console.log('Env variables set');
//   testResponse('מה תחזית מזג האוויר לשבוע הקרוב בקריות ?');
// });
