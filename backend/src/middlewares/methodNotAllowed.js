const { AppError } = require("../utils/appError");

function methodNotAllowed(allowedMethods) {
  return (req, _res, next) => {
    next(
      new AppError({
        code: "METHOD_NOT_ALLOWED",
        message: `Method ${req.method} is not allowed for ${req.originalUrl}`,
        status: 405,
        details: {
          allowedMethods,
        },
      })
    );
  };
}

module.exports = { methodNotAllowed };
