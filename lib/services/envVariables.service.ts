export const serverPortENV = 3333;

export const getPhoneNumbersENV = () => {
  const {
    MICHAEL_PHONE_NUMBER,
    YOSSI_PHONE_NUMBER,
    IRIT_PHONE_NUMBER,
    FAINA_PHONE_NUMBER,
    KIBENKO_PHONE_NUMBER,
    TREDER_PHONE_NUMBER,
  } = process.env;

  return {
    MICHAEL_PHONE_NUMBER,
    YOSSI_PHONE_NUMBER,
    IRIT_PHONE_NUMBER,
    FAINA_PHONE_NUMBER,
    KIBENKO_PHONE_NUMBER,
    TREDER_PHONE_NUMBER,
  };
};

export const getLLMSecretEnv = () => {
  const {
    OPENAI_API_KEY,
    OPENAI_ASSISTANT_ID,
    TAVILY_API_KEY,
    LANGCHAIN_TRACING_V2,
    LANGCHAIN_API_KEY,
    GOOGLE_API_KEY,
  } = process.env;

  return {
    OPENAI_API_KEY,
    OPENAI_ASSISTANT_ID,
    TAVILY_API_KEY,
    LANGCHAIN_TRACING_V2,
    LANGCHAIN_API_KEY,
    GOOGLE_API_KEY,
  };
};

export const getTradingGroupIdENV = () => {
  const { TRADING_GROUP_ID } = process.env;

  return TRADING_GROUP_ID;
};

export const AWSParameterNames = [
  'MICHAEL_PHONE_NUMBER',
  'YOSSI_PHONE_NUMBER',
  'IRIT_PHONE_NUMBER',
  'FAINA_PHONE_NUMBER',
  'TREDER_PHONE_NUMBER',
  'TRADING_GROUP_ID',
  'USER_EMAIL',
  'USER_EMAIL_PASSWORD',
  'DEEPSEEK_PASSWORD',
  'OPENAI_PASSWORD',
];
