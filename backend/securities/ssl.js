import axios from "axios";

/**
 * @param url {string}
 * @return {JSDOM}
 */
export const getSslDetails = async (url) => {
  const { hostname } = new URL(url);

  const response = await axios.get(`https://${hostname}:443`);

  return response.status < 400;
};
