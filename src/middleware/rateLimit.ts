import rateLimit from "express-rate-limit";
export const limitRate = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // Limit each IP to 30 requests per `window` (here, per 5 minutes).
  legacyHeaders: false,
  statusCode: 403,
  message: {
    message: "too many request",
  },
});
