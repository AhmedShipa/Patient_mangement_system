import Joi from "joi";

// validation of add doctor
const addDoctorVal = Joi.object({
  specialization: Joi.string().min(3).max(20),
  userId: Joi.string().hex().length(24),
  photo: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string()
      .valid("image/jpeg", "image/png", "image/gif", "image/jpg")
      .required(),
    size: Joi.number().max(5242880).required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
  }),
});

// validation of update doctor
const updateDoctorVal = Joi.object({
  specialization: Joi.string().min(3).max(20),
  userId: Joi.string().hex().length(24),
  photo: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string()
      .valid("image/jpeg", "image/png", "image/gif", "image/jpg")
      .required(),
    size: Joi.number().max(5242880).required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
  }),
});
export { addDoctorVal, updateDoctorVal };
