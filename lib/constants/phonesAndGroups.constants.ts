import { getPhoneNumbersENV } from '../services/envVariables.service';

export const getPhoneNumbers = () => {
  const {
    MICHAEL_PHONE_NUMBER: MICHAEL,
    YOSSI_PHONE_NUMBER: YOSSI,
    IRIT_PHONE_NUMBER: IRIT,
  } = getPhoneNumbersENV();

  return {
    MICHAEL,
    YOSSI,
    IRIT,
  };
};
