import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { GEMINI_MODELS, MODELS_TEMPRAUTRE } from '../constants/models.constant';

type GeminiModelInstancesType = Partial<
  Record<GEMINI_MODELS, ChatGoogleGenerativeAI>
>;

const GEMINI_MODEL_INSTANCES: GeminiModelInstancesType = {};

export const getLLMByModelName = (modelName: GEMINI_MODELS) => {
  if (!GEMINI_MODEL_INSTANCES[modelName]) {
    GEMINI_MODEL_INSTANCES[modelName] = new ChatGoogleGenerativeAI({
      model: modelName,
      temperature: MODELS_TEMPRAUTRE.MEDUIM,
    });
  }

  return GEMINI_MODEL_INSTANCES[modelName];
};
