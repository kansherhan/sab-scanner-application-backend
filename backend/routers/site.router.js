import { Router } from "express";
import { body } from "express-validator";

import { ValidatorMiddleware } from "../middlewares/validator.middleware.js";
import { getSslDetails } from "../securities/ssl.js";
import { getHeaderSecurityInfos } from "../securities/header.js";
import { getPageSpeedTest } from "../securities/speed.js";

const checkRouteValidators = [
  body("url").isString().isURL(),
  ValidatorMiddleware,
];

const router = Router();

router.post("/check", checkRouteValidators, async (request, response) => {
  try {
    const { url } = request.validData;

    const hasSsl = await getSslDetails(url);
    const headerSecurityInfos = await getHeaderSecurityInfos(url);
    const speedTest = await getPageSpeedTest(url);

    return response.json({
      ssl: hasSsl,
      headers: headerSecurityInfos,
      speed: speedTest,
    });
  } catch (e) {
    console.error(e);
    response.status(400).send();
  }
});

export default router;
