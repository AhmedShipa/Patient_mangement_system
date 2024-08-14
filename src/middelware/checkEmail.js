import { User } from "../models/user.model.js";
import { AppError } from "./appError.js";

export const checkEmail = async (req, res, next) => {
  const email = await User.findOne({ email: req.body.email });
  if (email) return next(new AppError(`email already exists`), 409);
  next();
};
