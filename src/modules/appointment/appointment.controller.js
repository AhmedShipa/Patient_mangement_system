import { AppError } from "../../middelware/appError.js";
import { catchError } from "../../middelware/catchError.js";
import { Appointment } from "../../models/appointment.model.js";
import { Doctor } from "../../models/doctor.model.js";
import { DateTime } from "luxon";
import { ApiFeatures } from "../../utilities/apiFeature.js";

// add new appointment
const addAppointment = catchError(async (req, res, next) => {
  // check if patient is unique in all doctor appointments
  // check if patient is unique in doctor appointment array
  const patientPresent = await Doctor.find();
  const newPatient = patientPresent.some((ele) => {
    return ele.appointments.some((ele2) => {
      return ele2.patientId == req.body.patientId;
    });
  });

  // setting dates date
  const fromDate = DateTime.fromISO(req.body.from);
  const toDate = DateTime.fromISO(req.body.to);
  const dateNow = DateTime.now();

  // if there is no conflict switch to add appointment
  if (!newPatient || newPatient.length === 0) {
    // check the from and to date
    if (fromDate <= dateNow || toDate <= dateNow || fromDate > toDate)
      return next(new AppError(`you can not reserve this date`, 409));
    // push appointment to doctor appointments
    await Doctor.findByIdAndUpdate(req.body.doctorId, {
      $push: { appointments: req.body },
    });
    // add appointment
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json(appointment);
  } else {
    return next(new AppError(`you already have an appointment`, 409));
  }
});

// get Appointments
const getAppointments = catchError(async (req, res, next) => {
  const dateNow = DateTime.now();
  // remove dates that expired
  const appointments = await Appointment.updateMany(
    { to: { $lt: dateNow } },
    {
      $set: {
        from: null,
        to: null,
        status: "completed",
      },
    }
  );

  // applying api features
  let apiFeatures = new ApiFeatures(Appointment.find(), req.query)
    .pagination()
    .fields()
    .filter()
    .sort()
    .search();
  let appointment = await apiFeatures.mongooseQuery;
  res
    .status(200)
    .json({ message: "success", page: apiFeatures.pageNumber, appointment });

});

// update appointment
const updateAppointment = catchError(async (req, res, next) => {
  // get Doctor And Check if he found or not
  const doctor = await Doctor.findById(req.body.doctorId);
  if (!doctor) return next(new AppError("Doctor Not Found", 409));

  const fromDate = DateTime.fromISO(req.body.from);
  const toDate = DateTime.fromISO(req.body.to);
  const dateNow = DateTime.now();

  if (fromDate <= dateNow || toDate <= dateNow || fromDate > toDate)
    return next(new AppError("you can not reserve this date", 409));

  const checkAppointment = await Appointment.findOne({
    doctor: req.body.doctorId,
    _id: req.params.id,
    ...req.body,
  });

  if (checkAppointment) {
    return next(
      new AppError("Time already scheduled. Please choose another time", 409)
    );
  }

  const updateAppointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  updateAppointment || next(new AppError("Appointment Not Found", 401));
  !updateAppointment ||
    res.status(201).json({ message: "Success Updated ...", updateAppointment });
});

// delete appointment
const deleteAppointment = catchError(async (req, res, next) => {
  await Appointment.findByIdAndDelete(req.params.id);
  updateAppointment || next(new AppError("Appointment Not Found", 401));
  !updateAppointment ||
    res.status(201).json({ message: "Success deleted ..." });
});

export {
  addAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
};
