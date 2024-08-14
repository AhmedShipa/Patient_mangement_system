import { catchError } from "../../middelware/catchError.js";
import fs from "fs";
import path from "path";
import { Patient } from "../../models/patient.model.js";
import { AppError } from "../../middelware/appError.js";
import { Doctor } from "../../models/doctor.model.js";
import { User } from "../../models/user.model.js";
import { ApiFeatures } from "../../utilities/apiFeature.js";

// add new patient
const addPatient = catchError(async (req, res, next) => {
  // check if patient have a complaint
  const complaint = await Patient.findOne({ userId: req.body.userId });
  if (complaint) return next(new AppError(`you already have a complaint`, 409));

  // find user firstName and lastName
  const user = await User.findById(req.body.userId);
  // concatenate firstName and lastName
  req.body.fullName = `${user.firstName} ${user.lastName}`;
  const patient = new Patient(req.body);
  await patient.save();
  res.status(201).json(patient);
});

// get patients
const getPatients = catchError(async (req, res, next) => {
  // applying api features
  let apiFeatures = new ApiFeatures(Patient.find(), req.query)
    .pagination()
    .fields()
    .filter()
    .sort()
    .search();
  let patient = await apiFeatures.mongooseQuery;
  res
    .status(200)
    .json({ message: "success", page: apiFeatures.pageNumber, patient });
});

// get patient
const getPatient = catchError(async (req, res, next) => {
  const patient = await Patient.findById(req.params.id).populate(
    "userId",
    "firstName lastName role"
  );
  res.status(201).json(patient);
});

// update patient
const updatePatient = catchError(async (req, res, next) => {
  const patient = await Patient.findOneAndUpdate(
    { userId: req.user.userId },
    req.body,
    {
      new: true,
    }
  );
  res.status(201).json({ message: `patient updated successfully`, patient });
});

// delete patient
const deletePatient = catchError(async (req, res, next) => {
  await Patient.findByIdAndDelete(req.params.id);
  res.status(201).json({ message: `patient deleted successfully` });
});

export { addPatient, getPatients, getPatient, updatePatient, deletePatient };
// // check if the booking time is greater than current time
// let dateNow = new Date();
// let egyptTime = new Date(
//   dateNow.toLocaleString("en-US", { timeZone: "Africa/Cairo" })
// );
// let bookingTime = await Patient.find();

// // filter the old dates
// let newBook = bookingTime.filter((ele) => {
//   if (ele.booking == null) {
//     return false;
//   } else {
//     let bookingDate = new Date(
//       ele.booking.toLocaleString("en-US", {
//         timeZone: "Africa/Cairo",
//       })
//     );
//     return bookingDate < egyptTime;
//   }
// });

// if (newBook) {
//   // get the array with old dates
//   newBook.map(async (ele) => {
//     await Patient.findByIdAndUpdate({ _id: ele._id }, { booking: null });
//     const patient = await Patient.find().populate(
//       "userId",
//       "firstName lastName role"
//     );
//     res.status(201).json(patient);
//   });
// } else {
//   const patient = await Patient.find().populate(
//     "userId",
//     "firstName lastName role"
//   );
//   res.status(201).json(patient);
// }
