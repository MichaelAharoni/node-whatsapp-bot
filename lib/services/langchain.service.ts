// import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
// import { GoogleCustomSearch } from '@langchain/community/tools/google_custom_search';
// import { ChatOpenAI } from '@langchain/openai';
// import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
// import { Message } from 'whatsapp-web.js';
// import { getLLMSecretEnv } from './envVariables.service';
// import {
//   ChatPromptTemplate,
//   MessagesPlaceholder,
// } from '@langchain/core/prompts';
// import { HumanMessage, AIMessage } from '@langchain/core/messages';
// import { RunnableLambda } from '@langchain/core/runnables';
// import { chatWithDeepSeek } from './puppeteer.service';

// process.env.OPENAI_API_KEY = LLMSecretEnv.OPENAI_API_KEY;
// process.env.TAVILY_API_KEY = LLMSecretEnv.TAVILY_API_KEY;
// process.env.LANGCHAIN_API_KEY = LLMSecretEnv.LANGCHAIN_API_KEY;
// process.env.LANGCHAIN_TRACING = 'true';
// process.env.GOOGLE_API_KEY = LLMSecretEnv.GOOGLE_API_KEY;
// process.env.GOOGLE_CSE_ID = '954a133ca6adb474f';

// // const travilyTool = new TavilySearchResults();
// const googleTool = new GoogleCustomSearch({
//   apiKey: LLMSecretEnv.GOOGLE_API_KEY,
//   googleCSEId: '954a133ca6adb474f',
// });

// // const tools = [travilyTool];
// const tools = [googleTool];
// const model = new ChatOpenAI({
//   model: 'gpt-4o',
//   temperature: 1,
// });

// const chatHistoryByFrom: Record<string, (HumanMessage | AIMessage)[]> = {};
// const llmWithTools = model.bindTools(tools);
// const prompt = ChatPromptTemplate.fromMessages([
//   [
//     'system',
//     [
//       'You are a 20-year-old man named Tom living in Israel.',
//       'You are conversational but never ask users if you can help them first.',
//       'Introduce yourself instead when meeting new users.',
//       'You are a native Hebrew speaker, but you can also converse in English.',
//       "All conversational context relates to Israel's time zone, except for questions about trading markets.",
//       'If the user speaks Hebrew, respond in Hebrew.',
//       'For each question a user asks, get your answer from the internet using tools, dont provide data answers based on your model data, only from the internet !.',
//       // "You will be provided two things: the user's message and additional content from which you must extract information.",
//       // 'Use this content to search for information and understand user queries.',
//     ].join(' '),
//   ],
//   ['placeholder', '{messages}'],
// ]);
// const chain = prompt.pipe(llmWithTools);

// const toolChain = RunnableLambda.from(async (userInput: string, config) => {
//   const {
//     metadata: { chatHistory },
//   } = config;
//   const aiMsg = await chain.invoke(
//     {
//       messages: [new HumanMessage(userInput)],
//     },
//     config
//   );
//   const toolMsgs = await googleTool.batch(aiMsg.tool_calls, config);
//   return chain.invoke(
//     {
//       messages: [...chatHistory, aiMsg, ...toolMsgs],
//     },
//     config
//   );
// });

// export const getAgentResultForUser = async (message: Message) => {
//   const { from, body: messageContent } = message;
//   return chatWithDeepSeek(messageContent);
//   // if (!chatHistoryByFrom[from]) {
//   //   chatHistoryByFrom[from] = [];
//   // }

//   // chatHistoryByFrom[from].push(new HumanMessage(messageContent));

//   // const toolResult = await toolChain.invoke(messageContent, {
//   //   metadata: { chatHistory: chatHistoryByFrom[from] },
//   // });

//   // chatHistoryByFrom[from].push(new AIMessage(toolResult.content as string));
//   // console.log('toolResult', JSON.stringify(toolResult));
//   // return toolResult.content as string;
// };

// // getAgentResultForUser({
// //   from: '546514664',
// //   body: `the user asks: "what time is it?, the content the extract data from is: 'Accessibility links
// // Skip to main content
// // Accessibility help
// // Accessibility feedback
// // Filters and topics
// // All
// // Images
// // Videos
// // News
// // Shopping
// // Web
// // Maps
// // More
// // Tools
// // Search Results
// // Local Time
// // 10:01
// // Wednesday, 1 January 2025 (GMT+2)
// // Time in Netivot
// // Feedback
// // Web result with site links

// // Time.is - שעה מדוייקת, בכל איזור זמן
// // Time.is
// // https://time.is › ...
// // ·
// // Translate this page
// // 7 מיליון מקומות, 58 שפות, מסונכרן עם שעון אטומי.
// // הזמן ב תל אביב-יפו, Ereẕ Yisra ...
// // השעה הוגדרה אחורה שעה אחת מ 02:00 אל 01:00 זמן מקומי. שישי מרץ ...

// // הזמן ב ניו יורק, ארה״ב עכשיו
// // השעה הוגדרה אחורה שעה אחת מ 02:00 אל 01:00 זמן מקומי. ראשון מרץ ...

// // הזמן ב Ereẕ Yisra’el עכשיו
// // שעה מדויקת כעת, אזור זמן, הפרש שעות, שעת זריחה/שקיעה ונתונים עיקריים ...

// // United States בדיוק הזמן הנוכחי ...
// // 17:56:30. שלישי דצמבר 31 2024 שבוע 1. New Year's Eve. ×. Time ...

// // הזמן ב Istanbul, טורקיה עכשיו
// // שעה מדויקת כעת, אזור זמן, הפרש שעות, שעת זריחה/שקיעה ונתונים עיקריים ...

// // More results from time.is »

// // שעון אונליין - מה השעה?
// // Online Alarm Kur
// // https://onlinealarmkur.com › clock
// // ·
// // Translate this page
// // מהו שעון אונליין? כאשר אתם רוצים לדעת, "מה השעה?", אתם יכולים להשתמש בשעון האונליין כדי לראות את השעה המדויקת בשעות, דקות ושניות.

// // שעה בתל אביב - יפו, ישראל
// // תאריך ושעה
// // https://www.שעון-עולמי.com › ILTLV
// // ·
// // Translate this page
// // איזור הזמן של תל אביב - יפו (ישראל) הינו GMT+2. שעה בתל אביב - יפו, ישראל: מה השעה בתל אביב - יפו? | שעה בתל אביב - ...

// // מחשבון המרת זמן בינלאומי 🗺️ | מה השעה בערים ומדינות שונות בעולם
// // worldtime.co.il
// // https://worldtime.co.il
// // ·
// // Translate this page
// // מצאו את השעה בערים ומדינות ברחבי העולם והפרש השעות בינן לבין ישראל. נסו את הכלי החינמי שלנו כדי לדעת את השעה, מזג האוויר וזמני כניסת השבת ביעד.

// // פינוקי, מה השעה? - מאת אֶרִיק הִיל
// // הוצאת שוקן
// // https://www.schocken.co.il › Book
// // ·
// // Translate this page
// // הִצְטָרְפוּ לְפִּנּוּקִי לְיוֹם מְלֵא פְּעִילוּת, וְעִזְרוּ לוֹ לָדַעַת מָה הַשָּׁעָה. סוֹבְבוּ אֶת מְחוֹגֵי הַשָּׁעוֹן, וְגַלּוּ מָתַי הוּא אוֹכֵל אֲרוּחַת בֹּקֶר, מָה הוּא אוֹהֵב לַעֲשׂוֹת אַחַר–הַצָּהֳרַיִם וּבְאֵיזוֹ שָׁעָה הוּא הוֹלֵךְ ...

// // מה השעה כעת - בשעון העולמי המקוון - שעון מקוון
// // clockil.com
// // https://clockil.com › time
// // ·
// // Translate this page
// // באתר האינטרנט הזה תוכל למצוא את השעה והתאריך בכל ארץ ועיר בעולם. תוכל גם לצפות בהפרש השעות בין מיקומך ומיקום העיר השנייה.
// // ‎ירושלים · ‎טיימר - ספירה לאחור · ‎ניו יורק, ארצות הברית · ‎טורונטו, קנדה

// // מה השעה (ואיפה?)
// // רשת עושים היסטוריה
// // https://www.osimhistoria.com › ep131-what-time-is-it
// // מהי המדינה הכי גדולה בעולם שנמצאת כולה באזור זמן אחד, ומהי המדינה הכי קטנה שיש בה כמה אזורי זמן? מה הקטע עם אזורי זמן בכלל? וגם האם אפשר לנסוע לטבריה ולהגיע ...
// // People also search for
// // מה השעה בישראל עם שניות
// // מה השעה עכשיו בישראל
// // מה השעה בישראל שעון קיץ
// // מה השעה עכשיו בישראל שעון חורף
// // שעון אונליין עם שניות
// // מה השעה שעון מחוגים
// // מה השעה עם שניות
// // שעון מדויק תל אביב
// // Page navigation

// // 1
// // 2

// // 3

// // 4

// // 5

// // 6

// // 7

// // 8

// // 9

// // 10

// // Next
// // Footer links
// // Results are not personalised
// // Israel
// // Netivot - From your IP address
// //  - Update location
// // HelpSend feedbackPrivacyTerms'`,
// // } as Message);

// // const toolChain = RunnableLambda.from(async (input: string, config) => {
// //   const { from, body: messageContent } = message;
// //   if (!chatHistoryByFrom[from]) {
// //     chatHistoryByFrom[from] = [];
// //   }

// //   chatHistoryByFrom[from].push(new HumanMessage(messageContent));

// //   const { output } = await agentExecuter.invoke({
// //     input: messageContent,
// //     chat_history: chatHistoryByFrom[from],
// //   });

// //   chatHistoryByFrom[from].push(new AIMessage(output));
// // });

// // let agentExecuter: AgentExecutor;

// // export const initializeAgent = async () => {
// //   const agent = await createOpenAIFunctionsAgent({
// //     llm: model,
// //     tools
// //     prompt,
// //   });

// //   agentExecuter = new AgentExecutor({ agent, tools });
// // };

// // export const getAgentResultForUser = async (message: Message) => {
// //   const { from, body: messageContent } = message;
// //   if (!chatHistoryByFrom[from]) {
// //     chatHistoryByFrom[from] = [];
// //   }

// //   chatHistoryByFrom[from].push(new HumanMessage(messageContent));

// //   const { output } = await agentExecuter.invoke({
// //     input: messageContent,
// //     chat_history: chatHistoryByFrom[from],
// //   });

// //   chatHistoryByFrom[from].push(new AIMessage(output));
// //   return output;
// // };

// // initializeAgent();
