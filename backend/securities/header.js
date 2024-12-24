import { JSDOM } from "jsdom";
import { translate } from "@vitalets/google-translate-api";

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const SECTION_SETTINGS = [
  {
    header: "Security Report Summary",
    translate: true,
    labelTranslate: true,
    descriptionTranslate: false,
  },
  {
    header: "Missing Headers",
    translate: true,
    labelTranslate: false,
    descriptionTranslate: true,
  },
  {
    header: "Raw Headers",
    translate: false,
    labelTranslate: false,
    descriptionTranslate: false,
  },
  {
    header: "Upcoming Headers",
    translate: true,
    labelTranslate: false,
    descriptionTranslate: true,
  },
  {
    header: "Warnings",
    translate: true,
    labelTranslate: false,
    descriptionTranslate: true,
  },
  {
    header: "Additional Information",
    translate: true,
    labelTranslate: false,
    descriptionTranslate: true,
  },
];
const SECURITY_HEADER_SITE_URL = "https://securityheaders.com/";

const translateText = async (text, lang) => {
  const response = await translate(text, {
    from: "en",
    to: lang,
  });

  return response.text;
};

export const getHeaderSecurityInfos = async (url, language) => {
  const dom = await loadHeaderSite(url);

  return await headerSiteParse(dom, language);
};

const loadHeaderSite = async (url) => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    executablePath: "/usr/bin/google-chrome",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(
    `${SECURITY_HEADER_SITE_URL}?q=${url}&hide=on&followRedirects=on`,
    {
      waitUntil: "domcontentloaded",
    },
  );
  await page.evaluate(() => {
    return document.body;
  });
  const htmlContent = await page.content();

  return new JSDOM(htmlContent);
};

const headerSiteParse = async (dom, language) => {
  const document = dom.window.document;
  const data = {
    score: "?",
    sections: [],
  };

  const reportSections = document.querySelectorAll(".reportSection");
  const scoreElement = document.querySelector(".score");

  if (scoreElement === null) return null;

  data.score = scoreElement.textContent.trim();

  for (const section of reportSections) {
    const titleElement = section.querySelector(".reportTitle");

    const titleText = titleElement.textContent.trim();

    const sectionSettings = SECTION_SETTINGS.find(
      (item) => item.header === titleText,
    );

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

    // if (sectionSettings.translate && language !== "en") {
    //   let allText = elements
    //     .map((element) => `${element.label},${element.description}`)
    //     .join(";");

    //   const text = await translateText(allText, language);

    //   const items = text.split(";");

    //   for (let i = 0; i < items.length; i++) {
    //     const parts = items[i].split(",");

    //     if (sectionSettings.labelTranslate) {
    //       elements[i].label = parts[0];
    //     }

    //     if (sectionSettings.descriptionTranslate) {
    //       elements[i].description = parts[1];
    //     }
    //   }
    // }

    data.sections.push({
      title: titleText,
      elements,
    });
  }

  return data;
};
