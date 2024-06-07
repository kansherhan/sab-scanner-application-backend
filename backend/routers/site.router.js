import { Router } from "express";
import { body } from "express-validator";

import { ValidatorMiddleware } from "../middlewares/validator.middleware.js";
import { getSslDetails } from "../securities/ssl.js";
import { getHeaderSecurityInfos } from "../securities/header.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const checkRouteValidators = [
  body("url").isString().isURL(),
  body("language").isString(),
  ValidatorMiddleware,
];

const router = Router();

router.post(
  "/check",
  AuthMiddleware,
  checkRouteValidators,
  async (request, response) => {
    try {
      const { url, language } = request.validData;

      const hasSsl = await getSslDetails(url);
      const headerSecurityInfos = await getHeaderSecurityInfos(url, language);

      return response.json({
        ssl: hasSsl,
        headers: headerSecurityInfos,
      });
    } catch (e) {
      console.error(e);
      return response.status(400).send(e.message);
    }
  },
);

export default router;
