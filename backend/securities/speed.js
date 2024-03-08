import axios from "axios";

const PAGE_SPEED_TEST_SITE_URL =
  "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

export const getPageSpeedTest = async (url) => {
  const pageSpeedTestData = await loadPageSpeedTest(url);

  const lighthouse = pageSpeedTestData.lighthouseResult;
  const loadingExperience = pageSpeedTestData.loadingExperience;

  return {
    lighthouse: {
      firstContentfulPaint:
        lighthouse.audits["first-contentful-paint"].displayValue,
      speedIndex: lighthouse.audits["speed-index"].displayValue,
      timeToInteractive: lighthouse.audits["interactive"].displayValue,
      firstMeaningfulPaint:
        lighthouse.audits["first-meaningful-paint"].displayValue,
      firstCPUIdle: lighthouse.audits["first-cpu-idle"].displayValue,
      estimatedInputLatency:
        lighthouse.audits["estimated-input-latency"].displayValue,
    },
    cruxMetrics: {
      firstContentfulPaint:
        loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.category,
      firstInputDelay: loadingExperience.metrics.FIRST_INPUT_DELAY_MS.category,
    },
  };
};

const loadPageSpeedTest = async (url) => {
  const response = await axios.get(PAGE_SPEED_TEST_SITE_URL, {
    params: {
      url,
    },
  });

  return response.data;
};
