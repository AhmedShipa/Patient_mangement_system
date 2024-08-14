import { Router } from "express";
import { allowedTo, protectedRoutes } from "../user/user.controller.js";
import {
  addAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointment,
} from "./appointment.controller.js";

export const appointmentRouter = Router();
appointmentRouter
  .route("/")
  .post(protectedRoutes, allowedTo("admin"), addAppointment)
  .get(getAppointments);

appointmentRouter
  .route("/:id")
  .put(protectedRoutes, allowedTo("admin"), updateAppointment)
  .delete(protectedRoutes, allowedTo("admin"), deleteAppointment);
