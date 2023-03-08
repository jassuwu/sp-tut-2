const { validationResult } = require("express-validator");

const validationMiddleware = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 400, errors: errors.array() });
  }

  next();
};

module.exports = (validations) => {
  return [...validations, validationMiddleware];
};
