import { model, Schema, Types } from "mongoose";

const schema = new Schema(
  {
    doctorId: {
      type: Types.ObjectId,
      ref: "Doctor",
    },
    patientId: {
      type: Types.ObjectId,
      ref: "patient",
    },
    from: Date,
    to: Date,
    status: String,
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const Appointment = model("Appointment", schema);
