export const FullAccessMiddleware = (request, response, next) => {
  const user = request.user;

  if (!user) return response.status(401).send("User not found!");

  if (user.isAdmin) {
    return next();
  } else {
    return response.status(403).send("User is not admin!");
  }
};
