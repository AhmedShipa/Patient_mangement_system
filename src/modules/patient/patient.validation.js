import Joi from "joi";

// validation of add doctor
const addPatientVal = Joi.object({
  complaint: Joi.string().min(3).max(20),
  userId: Joi.string().hex().length(24),
  booking: Joi.string(),
});

// validation of update doctor
const updatePatientVal = Joi.object({
  complaint: Joi.string().min(3).max(20),
  userId: Joi.string().hex().length(24),
  booking: Joi.string(),
});
export { addPatientVal, updatePatientVal };
