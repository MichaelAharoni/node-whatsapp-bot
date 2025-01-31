import Imap from 'node-imap';
import { ParsedMail, simpleParser } from 'mailparser';
import { HALF_A_SECOND } from '../constants/timeInMs.constants';

interface ImapConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  tls: boolean;
}

const OPENAI_EMAIL = 'noreply@tm.openai.com';
const imapState: { imapInstance: ImapListener; isReady: boolean } = {
  imapInstance: null!,
  isReady: false,
};

class ImapListener {
  private imap: Imap;

  constructor(private config: ImapConfig) {
    this.imap = new Imap(config);
  }

  private openInbox(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.imap.openBox('INBOX', true, (err: Error | null, box: Imap.Box) => {
        if (err) {
          return reject(err);
        }
        console.log(`Opened inbox: ${box.name}`);
        resolve();
      });
    });
  }

  private parseEmail(stream: NodeJS.ReadableStream): Promise<ParsedMail> {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      simpleParser(stream, (err: Error | null, parsed: ParsedMail) => {
        if (err) return reject(err);
        resolve(parsed);
      });
    });
  }

  public startListening(): void {
    this.imap.once('ready', async () => {
      try {
        await this.openInbox();
        imapState.isReady = true;
        console.log('Listening for new emails...');

        this.imap.on('mail', (numNewMsgs: number) => {
          console.log(`New mail detected: ${numNewMsgs} messages.`);

          this.imap.search(['UNSEEN'], (err, results) => {
            if (err) {
              console.error('Search error:', err);
              return;
            }

            if (!results || results.length === 0) {
              console.log('No unread emails.');
              return;
            }

            const latestEmailSeqNo = results[results.length - 1];

            // Fetch unread emails
            const fetch = this.imap.fetch(latestEmailSeqNo, {
              bodies: '',
              markSeen: true, // Mark emails as read after fetching
            });

            fetch.on('message', msg => {
              msg.on('body', async stream => {
                try {
                  const parsed = await this.parseEmail(stream);
                  // Filter and process email based on conditions
                  if (parsed.from?.text.includes(OPENAI_EMAIL)) {
                    const verificationCode = parsed.text?.match(/\d{6}/)?.[0];
                    process.env.OPENAI_VERIFICATION_CODE = verificationCode;
                  }
                } catch (error) {
                  console.error('Error parsing email:', error);
                }
              });
            });

            fetch.once('error', err => {
              console.error('Fetch error:', err);
            });
          });
        });
      } catch (error) {
        console.error('Error initializing IMAP listener:', error);
      }
    });

    this.imap.once('error', err => {
      console.error('IMAP connection error:', err);
    });

    this.imap.once('end', () => {
      console.log('IMAP connection ended.');
    });

    this.imap.connect();
  }
}

// Configuration
const imapConfig: ImapConfig = {
  user: null!,
  password: null!,
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
};

export const waitUntilImapListenerReady = async () => {
  return new Promise(resolve => {
    const checkReady = () => {
      if (imapState.isReady) {
        resolve(true);
      } else {
        setTimeout(checkReady, HALF_A_SECOND);
      }
    };

    checkReady();
  });
};

// Initialize and start listening
export const initImap = async () => {
  console.log('Initializing IMAP listener...');
  imapConfig.user = process.env.USER_EMAIL as string;
  imapConfig.password = process.env.USER_EMAIL_PASSWORD as string;
  imapState.imapInstance = new ImapListener(imapConfig);
  imapState.imapInstance.startListening();
  await waitUntilImapListenerReady();
  console.log('IMAP listener ready.');
};
