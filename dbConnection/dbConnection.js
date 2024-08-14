import mongoose from "mongoose";
export const dbConnection = mongoose
  .connect("mongodb://localhost:27017/patient_management")
  .then(() => {
    console.log(`database connected successfully`);
  })
  .catch(() => {
    console.log(`database failed to connected`);
  });
