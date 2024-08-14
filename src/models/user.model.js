import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";

const schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["doctor", "patient", "admin"],
      required: true,
    },
    passwordChangedAt: Date,
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

schema.pre("save", function () {
  this.password = bcrypt.hashSync(this.password, 8);
});


export const User = model("User", schema);
