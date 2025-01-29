import { AgentExecutor } from 'langchain/agents';
import { createToolCallingAgent } from 'langchain/agents';
import { getLLMByModelName } from '../models/gemini.model';
import { GEMINI_MODELS } from '../constants/models.constant';
import { tickerPriceFetcherTool } from '../tools/tickerPriceFetcher.tool';
import { ChatPromptTemplate } from '@langchain/core/prompts';

const prompt = ChatPromptTemplate.fromMessages([
  ['system', 'You are a helpful assistant, use your tools to help me with the following task:'],
  ['human', '{input}'],
  ['placeholder', '{agent_scratchpad}'],
]);

export const geminiAgent = createToolCallingAgent({
  llm: getLLMByModelName(GEMINI_MODELS.GEMINI_1_5_flash),
  tools: [tickerPriceFetcherTool],
  prompt,
});

export const geminiAgentExecutor = new AgentExecutor({
  agent: geminiAgent,
  tools: [tickerPriceFetcherTool],
});

(async () => {
  const agentResponse = await geminiAgentExecutor.invoke({
    input: 'What is the price of Bitcoin and the nasdaq, and what was yesterday price of the stock bvolagjans ?',
  });
  console.log('agentResponse', agentResponse);
})();
