import axios from "axios";
import { JSDOM } from "jsdom";

const SECURITY_HEADER_SITE_URL = "https://securityheaders.com/";

/**
 * @param url {string}
 * @return {Promise<{good: Array<any>, bad: Array<any>}>}
 */
export const getHeaderSecurityInfos = async (url) => {
  const dom = await loadHeaderSite(url);

  return await headerSiteParse(dom);
};

/**
 * @param url {string}
 * @return {JSDOM}
 */
const loadHeaderSite = async (url) => {
  const response = await axios.get(SECURITY_HEADER_SITE_URL, {
    params: {
      q: url,
      hide: "on",
      followRedirects: "on",
    },
  });

  return new JSDOM(response.data);
};

/**
 * @param dom {JSDOM}
 * @return {any}
 */
const headerSiteParse = (dom) => {
  const document = dom.window.document;
  const data = {
    score: "?",
    sections: [],
  };

  const reportSections = document.querySelectorAll(".reportSection");

  const scoreElement = document.querySelector(".score");

  data.score = scoreElement.textContent.trim();

  for (const section of reportSections) {
    const titleElement = section.querySelector(".reportTitle");
    const elements = [];

    for (const element of section.querySelectorAll(".reportTable .tableRow")) {
      const elementLabel = element.querySelector(".tableLabel");
      const elementDescription = element.querySelector(".tableCell");

      const linkElement = elementDescription.querySelector("a");

      const elementData = {
        label: elementLabel.textContent.trim(),
        description: elementDescription.textContent.trim(),
      };

      if (linkElement) {
        elementData.link = linkElement.getAttribute("href");
      }

      elements.push(elementData);
    }

    data.sections.push({
      title: titleElement.textContent.trim(),
      elements,
    });
  }

  return data;
};
