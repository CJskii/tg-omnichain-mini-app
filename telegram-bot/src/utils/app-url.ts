export const constructUrl = ({ botName, uid }): string => {
  const BASE_URL = process.env.EXTERNAL_URL;
  return `${BASE_URL}?botName=${botName}&uid=${uid}`;
};
