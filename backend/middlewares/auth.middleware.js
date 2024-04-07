import { User } from "../databases/models/User.js";

export const AuthMiddleware = async (request, response, next) => {
  try {
    const userToken = request.headers.authorization;

    if (!userToken) {
      return response.status(400).send("Token authorization not found!");
    }

    const token = userToken.split(" ")[1];

    const user = await User.findOne({
      where: {
        token,
      },
    });

    if (!user) {
      return response.status(404).send("User not found!");
    }

    if (user.isBanned) {
      return response.status(403).send("User is banned!");
    }

    request.user = user;

    return next();
  } catch (e) {
    console.error(e);
    response.status(400).send(e.message);
  }
};
