import { NextFunction, Request, Response } from "express";
import sanitizeHtml from "sanitize-html";

export function sanitize(req: Request, res: Response, next: NextFunction) {
  if (req.body && typeof req.body === "object") {
    console.log("before sanitize", req.body);
    for (let [key, value] of Object.entries(req.body)) {
      if (typeof value === "string") {
        req.body[key] = sanitizeHtml(value, {
          allowedTags: ["input", "h1", "h2", "h3", "p"],
          allowedAttributes: { input: ["type", "name", "value"] },
        });
      }
    }
    console.log("after sanitize", req.body);
  }
  next();
}
