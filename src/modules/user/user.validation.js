import Joi from "joi";

// validation of signUp
const signUpVal = Joi.object({
  firstName: Joi.string().min(3).max(10).required(),
  lastName: Joi.string().min(3).max(10).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[A-Z][a-z0-9A-Z]{8,40}$/)
    .required(),
  role: Joi.string().required(),
});

// validation of signIn
const signInVal = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[A-Z][a-z0-9A-Z]{8,40}$/)
    .required(),
});

// validation of changePassword
const changePasswordVal = Joi.object({
  oldPassword: Joi.string()
    .pattern(/^[A-Z][a-z0-9A-Z]{8,40}$/)
    .required(),
  newPassword: Joi.string()
    .pattern(/^[A-Z][a-z0-9A-Z]{8,40}$/)
    .required(),
});

// validation of addUser
const addUserVal = Joi.object({
  firstName: Joi.string().min(3).max(10).required(),
  lastName: Joi.string().min(3).max(10).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[A-Z][a-z0-9A-Z]{8,40}$/)
    .required(),
  role: Joi.string().required(),
});

// validation of updateUser
const updateUserVal = Joi.object({
  firstName: Joi.string().min(3).max(10).required(),
  lastName: Joi.string().min(3).max(10).required(),
  email: Joi.string().email().required(),
});

// validation of delete user
const deleteUserVal = Joi.object({
  userId: Joi.string().hex().length(24),
});
export {
  signUpVal,
  signInVal,
  changePasswordVal,
  addUserVal,
  updateUserVal,
  deleteUserVal,
};
