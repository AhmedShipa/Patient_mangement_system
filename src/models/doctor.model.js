import { model, Schema, Types } from "mongoose";

const schema = new Schema(
  {
    specialization: {
      type: String,
      enum: ["cardiology", "oncology", "neurology", "pediatrics", "surgery"],
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
    },
    photo: String,
    fullName: String,
    appointments: [],
  },
  {
    timestamps: false,
    versionKey: false,
  }
);
schema.post("init", function (doc) {
  if (doc.photo) doc.photo = process.env.BASE_URL + "doctor/" + doc.photo;
});

export const Doctor = model("Doctor", schema);
