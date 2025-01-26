import { ElementHandle } from 'puppeteer';
import { HALF_A_SECOND, TWO_SECONDS } from '../constants/timeInMs.constants';

export const waitForCompletion = async (element: ElementHandle<Element>) => {
  const interval = HALF_A_SECOND;
  let previousText = '';
  return new Promise((resolve) => {
    const checkCompletion = async () => {
      const currentText = await element?.evaluate(
        (el: Element) => el.textContent
      );
      const regex = /^(Searching the web\.{3}|Found \d+ results)$/;
      const isLoading = regex.test(currentText || '');
      if (currentText && !isLoading && currentText === previousText) {
        setTimeout(
          (text) => {
            resolve(text);
          },
          TWO_SECONDS,
          currentText
        );
      } else {
        previousText = currentText!;
        setTimeout(checkCompletion, interval);
      }
    };
    checkCompletion();
  });
};

export const getSessionIdFromUrl = () => {
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const pathParts = url.pathname.split('/');
  const sessionId = pathParts[pathParts.length - 1];

  return sessionId;
};

export const waitUntilParentChildCountIncreased = async (
  parentElement: ElementHandle<Element>,
  increasedByCount: number,
  _originalLength?: number
) => {
  const originalLength =
    _originalLength ||
    (await parentElement.evaluate((el) => el.children.length));
  return new Promise(async (resolve) => {
    const currentChildCount = await parentElement.evaluate(
      (el) => el.children.length
    );
    const targetChildCount = originalLength + increasedByCount;
    if (currentChildCount >= targetChildCount) {
      resolve(null);
    } else {
      setTimeout(
        () =>
          waitUntilParentChildCountIncreased(
            parentElement,
            increasedByCount,
            originalLength
          ).then(resolve),
        HALF_A_SECOND
      );
    }
  });
};

export const resolveAfterTimeout = (timeout: number) =>
  new Promise((resolve) => setTimeout(resolve, timeout));
