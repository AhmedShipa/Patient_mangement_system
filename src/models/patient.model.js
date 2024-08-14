import bcrypt from "bcrypt";
import { model, Schema, Types } from "mongoose";

const schema = new Schema(
  {
    complaint: {
      type: String,
      enum: ["cardiology", "oncology", "neurology", "pediatrics", "surgery"],
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
    },
    fullName: String,
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const Patient = model("Patient", schema);
