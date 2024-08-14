import { Router } from "express";
import { validate } from "../../middelware/validate.js";
import { addDoctorVal, updateDoctorVal } from "./doctor.validation.js";
import { allowedTo, protectedRoutes } from "../user/user.controller.js";
import { uploadSingleFile } from "../../../fileUpload/fileUpload.js";
import {
  addDoctor,
  deleteDoctor,
  getDoctor,
  getDoctors,
  updateDoctor,
} from "./doctor.controller.js";

export const doctorRouter = Router();
doctorRouter
  .route("/")
  .post(
    validate(addDoctorVal),
    protectedRoutes,
    allowedTo("doctor","admin"),
    uploadSingleFile("photo", "doctor"),
    addDoctor
  )
  .get(getDoctors)
  .put(
    validate(updateDoctorVal),
    protectedRoutes,
    allowedTo("doctor"),
    uploadSingleFile("photo", "doctor"),
    updateDoctor
  );

doctorRouter
  .route("/:id")
  .get(getDoctor)
  .delete(protectedRoutes, allowedTo("admin"), deleteDoctor);
