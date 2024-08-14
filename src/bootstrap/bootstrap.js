import { appointmentRouter } from "../modules/appointment/appointment.routes.js";
import { doctorRouter } from "../modules/doctor/doctor.routes.js";
import { patientRouter } from "../modules/patient/patient.routes.js";
import { userRouter } from "../modules/user/user.routes.js";

const bootstrap = (app) => {
  app.use("/api/users", userRouter);
  app.use("/api/doctors", doctorRouter);
  app.use("/api/patients", patientRouter);
  app.use("/api/appointments", appointmentRouter);
};

export default bootstrap;
