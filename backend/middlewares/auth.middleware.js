import { User } from "../databases/models/User.js";

export const AuthMiddleware = async (request, response, next) => {
  try {
    const userToken = request.header("Authorization");

    if (userToken) {
      return response.status(400).send("Нету токен авторизаций!");
    }

    const user = await User.findOne({
      where: {
        token: userToken,
      },
    });

    if (user) {
      request.user = user;

      return next();
    } else {
      return response
        .status(400)
        .send("Пользовател с такими данными не найден!");
    }
  } catch (e) {
    console.error(e);
    response.status(400).send(e.message);
  }
};
