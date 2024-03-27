import { Router } from "express";
import { body } from "express-validator";

import { User } from "../databases/models/User.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { FullAccessMiddleware } from "../middlewares/full-access.middleware.js";
import { ValidatorMiddleware } from "../middlewares/validator.middleware.js";

const userEditRouteValidators = [
  body("userID").isNumeric(),
  body("value").isBoolean(),
  ValidatorMiddleware,
];

const router = Router();

router.get("/me", AuthMiddleware, (request, response) =>
  response.json(request.user),
);

router.get(
  "/get-all-users",
  AuthMiddleware,
  FullAccessMiddleware,
  async (request, response) => {
    try {
      const users = await User.findAll({
        where: {
          isAdmin: false,
        },
      });

      return response.json(users);
    } catch (e) {
      console.error(e);
      return response.status(500).send(e.message);
    }
  },
);

router.post(
  "/edit-access",
  AuthMiddleware,
  FullAccessMiddleware,
  userEditRouteValidators,
  async (request, response) => {
    try {
      const { userID, value } = request.validData;

      const user = await User.findOne({
        where: {
          id: userID,
        },
      });

      if (!user) {
        return response.status(400).send(`User with ID(${userID}) not found!`);
      }

      user.hasAccess = value;
      await user.save();

      return response.status(200).send("OK");
    } catch (e) {
      console.error(e);
      return response.status(500).send(e.message);
    }
  },
);

router.post(
  "/user-ban-edit",
  AuthMiddleware,
  FullAccessMiddleware,
  userEditRouteValidators,
  async (request, response) => {
    try {
      const { userID, value } = request.validData;

      const user = await User.findOne({
        where: {
          id: userID,
        },
      });

      if (!user) {
        return response.status(400).send(`User with ID(${userID}) not found!`);
      }

      user.isBanned = value;
      await user.save();

      return response.status(200).send("OK");
    } catch (e) {
      console.error(e);
      return response.status(500).send(e.message);
    }
  },
);

export default router;
