import express from "express";
import {
  addUser,
  allowedTo,
  changePassword,
  deleteUser,
  getUsers,
  login,
  protectedRoutes,
  signUp,
  updateUser,
} from "./user.controller.js";

import { validate } from "../../middelware/validate.js";
import {
  addUserVal,
  changePasswordVal,
  deleteUserVal,
  signInVal,
  signUpVal,
  updateUserVal,
} from "./user.validation.js";
import { checkEmail } from "../../middelware/checkEmail.js";
export const userRouter = express.Router();

userRouter
  .route("/")
  .post(validate(signUpVal), checkEmail, signUp)
  .get( getUsers)
  .put(
    validate(updateUserVal),
    protectedRoutes,
    allowedTo("doctor", "patient"),
    checkEmail,
    updateUser
  )
  .delete(
    validate(deleteUserVal),
    protectedRoutes,
    allowedTo("admin", "doctor", "patient"),
    deleteUser
  );

userRouter.post("/login", validate(signInVal), login);

userRouter.patch(
  "/changePassword",
  validate(changePasswordVal),
  changePassword
);

userRouter.post(
  "/addUser",
  validate(addUserVal),
  protectedRoutes,
  allowedTo("admin"),
  checkEmail,
  addUser
);
