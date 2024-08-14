import { Router } from "express";

import { validate } from "../../middelware/validate.js";
import { allowedTo, protectedRoutes } from "../user/user.controller.js";
import { addPatientVal, updatePatientVal } from "./patient.validation.js";
import {
  addPatient,
  deletePatient,
  getPatient,
  getPatients,
  updatePatient,
} from "./patient.controller.js";

export const patientRouter = Router();
patientRouter
  .route("/")
  .post(
    validate(addPatientVal),
    protectedRoutes,
    allowedTo("patient"),
    addPatient
  )
  .get(getPatients)
  .put(
    validate(addPatientVal),
    protectedRoutes,
    allowedTo("patient"),
    updatePatient
  );

patientRouter
  .route("/:id")
  .get(getPatient)
  .delete(protectedRoutes, allowedTo("admin"), deletePatient);
