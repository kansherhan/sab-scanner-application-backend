import { matchedData, validationResult } from "express-validator";

export const ValidatorMiddleware = async (request, response, next) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  request.validData = matchedData(request);

  return next();
};
