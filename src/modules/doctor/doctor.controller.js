import { AppError } from "../../middelware/appError.js";
import { catchError } from "../../middelware/catchError.js";
import { Doctor } from "../../models/doctor.model.js";

import fs from "fs";
import path from "path";
import { User } from "../../models/user.model.js";
import { DateTime } from "luxon";
import { ApiFeatures } from "../../utilities/apiFeature.js";

// add new doctor
const addDoctor = catchError(async (req, res, next) => {
  // check if doctor have a specialization
  const specialization = await Doctor.findOne({ userId: req.body.userId });
  if (specialization) {
    req.body.photo = req.file.filename;
    const destinationPath = path.resolve(`uploads/doctor/${req.body.photo}`);
    if (fs.existsSync(destinationPath)) {
      fs.unlinkSync(destinationPath);
    }
    return next(new AppError(`you already have a specialization`, 409));
  } else {
    // find user firstName and lastName
    const user = await User.findById(req.body.userId);
    req.body.photo = req.file.filename;
    // concatenate firstName and lastName
    req.body.fullName = `${user.firstName} ${user.lastName}`;
    const doctor = new Doctor(req.body);

    await doctor.save();
    res.status(201).json(doctor);
  }
});
// get doctors
const getDoctors = catchError(async (req, res, next) => {
  // convert the dateNow to a format like toDate format
  const dateNow = DateTime.now();
  let dateNowAfterConvert = dateNow.toISO({
    includeOffset: false,
    suppressMilliseconds: true,
    includeSeconds: true,
  });
  // update the appointments
  await Doctor.updateMany(
    {},
    {
      $pull: {
        appointments: {
          to: { $lt: dateNowAfterConvert },
        },
      },
    }
  );

  // applying api features
  let apiFeatures = new ApiFeatures(Doctor.find(), req.query)
    .pagination()
    .fields()
    .filter()
    .sort()
    .search();
  let doctor = await apiFeatures.mongooseQuery;
  res
    .status(200)
    .json({ message: "success", page: apiFeatures.pageNumber, doctor });
});

// get doctor
const getDoctor = catchError(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.id).populate(
    "userId",
    "firstName lastName role"
  );
  res.status(201).json(doctor);
});

// update doctor
const updateDoctor = catchError(async (req, res, next) => {
  // catching old photo
  const oldDoctor = await Doctor.findOne({ userId: req.body.userId });
  const file = oldDoctor.photo.split("/");
  const oldPhoto = file[5];
  const destinationPath = path.resolve(`uploads/doctor/${oldPhoto}`);
  // deleting oldPhoto
  if (fs.existsSync(destinationPath)) {
    fs.unlinkSync(destinationPath);
  }
  // updating new doctor
  const doctor = await Doctor.findOneAndUpdate(
    { userId: req.user.userId },
    req.body,
    {
      new: true,
    }
  );
  res.status(201).json({ message: `doctor updated successfully`, doctor });
});

// delete doctor
const deleteDoctor = catchError(async (req, res, next) => {
  // catching old photo
  const oldDoctor = await Doctor.findOne({ userId: req.params.id });
  const file = oldDoctor.photo.split("/");
  const oldPhoto = file[5];
  const destinationPath = path.resolve(`uploads/doctor/${oldPhoto}`);
  // deleting oldPhoto
  if (fs.existsSync(destinationPath)) {
    fs.unlinkSync(destinationPath);
  }
  // deleting new doctor
  await Doctor.findOneAndDelete({ userId: req.params.id });
  res.status(201).json({ message: `doctor deleted successfully` });
});

export { addDoctor, getDoctors, getDoctor, updateDoctor, deleteDoctor };
