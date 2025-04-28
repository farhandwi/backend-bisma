import { ResponseError } from "../error/response-error.js";

const errorMiddleware = async (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof ResponseError) {
    res
      .status(err.status)
      .json({
        status: err.status,
        success: false,
        message: err.message,
        url: req.protocol + "://" + req.get("host") + req.originalUrl,
      })
      .end();
  } else {
    res
      .status(500)
      .json({
        status: 500,
        success: false,
        message: err.message,
        url: req.protocol + "://" + req.get("host") + req.originalUrl,
      })
      .end();
  }
};

export { errorMiddleware };
