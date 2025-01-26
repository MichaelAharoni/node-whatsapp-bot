import express from 'express';
import {
  initClient,
  sendMessagesWhenReady,
} from './lib/services/whatsApp.service';
import { serverPortENV } from './lib/services/envVariables.service';
import { setEnvVariables } from './lib/services/awsParemeterStore.service';
import { initImap } from './lib/services/imap.service';
// import { initPuppeteerPage } from './lib/services/puppeteer-gpt.service';
import { initPuppeteerPage } from './lib/services/puppeteer.service';
import { initJobRunner } from './lib/services/jobRunner.service';

const app = express();
const port = serverPortENV;

const init = async () => {
  console.log('Starting the server...');
  await setEnvVariables();
  // await initImap();
  await initClient();
  await initPuppeteerPage();
  await initJobRunner();
  await sendMessagesWhenReady();
};

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/health', (req, res) => {
  res.send('I am alive!');
});

app.listen(port, async () => {
  await init();
  return console.log(`Express is listening at http://localhost:${port}`);
});
