import { Router } from "express";
import { body } from "express-validator";
import { ValidatorMiddleware } from "../middlewares/validator.middleware.js";

const checkRouteValidators = [
  body("url").isString().isURL(),
  ValidatorMiddleware,
];

const router = Router();

router.post("/check", checkRouteValidators, (request, response) => {
  try {
  } catch (e) {
    console.error(e);
  }
});

export default router;
