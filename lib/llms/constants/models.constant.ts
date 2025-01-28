export const OPEN_AI_MODELS = {
  GPT3_5: 'gpt3.5-turbo',
  GPT4_O: 'gpt-4o',
  GPT4_O_MINI: 'gpt-4o-mini',
};

export enum GEMINI_MODELS {
  GEMINI_1_5_flash = 'models/gemini-1.5-flash',
  GEMINI_1_5_flash_8B = 'models/gemini-1.5-flash-8b',
  GEMINI_1_5_PRO = 'models/gemini-1.5-pro',
}

export const MODELS_TEMPRAUTRE = {
  NONE: 0,
  LIGHT: 0.2,
  MEDUIM: 0.5,
  STRONG: 0.8,
  STRICT: 1,
};
// process.env.OPEN_AI_API_KEY = 'your-openai-api-key';
process.env.GOOGLE_API_KEY = 'AIzaSyASiwcaPU72KAiLYAL1hlcpqKoDV5BT-Es';
// process.env.GEMINI_API_KEY = 'AIzaSyASiwcaPU72KAiLYAL1hlcpqKoDV5BT-Es';
