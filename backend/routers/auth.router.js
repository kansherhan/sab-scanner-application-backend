import { Router } from "express";
import { body } from "express-validator";
import sha256 from "sha256";

import { User } from "../databases/models/User.js";
import { ValidatorMiddleware } from "../middlewares/validator.middleware.js";
import { randomString } from "../utils/random.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const loginRouteValidators = [
  body("email").isString().isLength({ min: 2, max: 50 }),
  body("password").isString().isLength({ min: 6, max: 255 }),
  ValidatorMiddleware,
];

const registerRouteValidators = [
  body("email").isString().isLength({ min: 2, max: 50 }),
  body("password").isString().isLength({ min: 6, max: 255 }),
  body("firstName").isString().isLength({ min: 2, max: 30 }),
  ValidatorMiddleware,
];

const router = Router();

router.post("/login", loginRouteValidators, async (request, response) => {
  try {
    const { email, password } = request.validData;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return response.status(400).send("Такого пользователя нету!");
    }

    if (user.password !== sha256(password)) {
      return response.status(400).send("Ошибка при почте или пароле!");
    }

    return response.json(user);
  } catch (e) {
    console.error(e);
    response.status(500).send(e.message);
  }
});

router.post("/register", registerRouteValidators, async (request, response) => {
  try {
    const { email, password, firstName } = request.validData;

    const existsUser = await User.findOne({
      where: {
        email,
      },
    });

    if (existsUser) {
      return response.status(400).send("There is already such an email!");
    }

    const user = await User.create({
      email,
      firstName,
      password: sha256(password),
      token: randomString(32),
    });

    return response.json(user);
  } catch (e) {
    console.error(e);
    response.status(400).send(e.message);
  }
});

router.get("/check", AuthMiddleware, async (request, response) => {
  response.json(request.user);
});

export default router;
