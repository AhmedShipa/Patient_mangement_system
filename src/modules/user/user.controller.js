import { AppError } from "../../middelware/appError.js";
import { catchError } from "../../middelware/catchError.js";
import { User } from "../../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiFeatures } from "../../utilities/apiFeature.js";

// signUp new user
const signUp = catchError(async (req, res, next) => {
  const user = new User(req.body);
  await user.save();
  // generating token
  jwt.sign(
    { userId: user._id, role: user.role },
    process.env.SECRET_KEY_TOKEN,
    (err, token) => {
      user.password = undefined;
      res.json({ message: "registration done successfully ", user, token });
    }
  );
});

// add new user
const addUser = catchError(async (req, res, next) => {
  const user = new User(req.body);
  await user.save();
  // generating token
  jwt.sign(
    { userId: user._id, role: user.role },
    process.env.SECRET_KEY_TOKEN,
    (err, token) => {
      req.body.password = undefined;
      res.json({ message: "user added successfully ", user, token });
    }
  );
});

// signIn user
const login = catchError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  // check email and password is right
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    // generating token
    jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRET_KEY_TOKEN,
      (err, token) => {
        res.json({ message: "logged in successfully ", token });
      }
    );
  } else {
    return next(new AppError(`wrong email or password`, 401));
  }
});

// get users
const getUsers = catchError(async (req, res, next) => {
  // applying api features
  let apiFeatures = new ApiFeatures(User.find(), req.query)
    .pagination()
    .fields()
    .filter()
    .sort()
    .search();
  let user = await apiFeatures.mongooseQuery;
  res
    .status(200)
    .json({ message: "success", page: apiFeatures.pageNumber, user });
});

// update user
const updateUser = catchError(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.userId, req.body, {
    new: true,
  });
  res.json({ message: "user updated successfully ", user });
});

// delete user
const deleteUser = catchError(async (req, res, next) => {
  if (req.user.role == "admin") {
    await User.findByIdAndDelete(req.query.userId);
    res.json({ message: "user deleted successfully " });
  } else {
    await User.findByIdAndDelete(req.user.userId);
    res.json({ message: "user deleted successfully " });
  }
});

// change password
const changePassword = async (req, res, next) => {
  let token = req.headers.token;
  let userPayload = null;
  // verifying token
  jwt.verify(token, process.env.SECRET_KEY_TOKEN, (err, payload) => {
    if (err) return next(new AppError(`invalid token`, 401));
    userPayload = payload;
  });
  // check the id in the token is right
  let user = await User.findById(userPayload.userId);
  // check the old password is right
  if (!user || !bcrypt.compareSync(req.body.oldPassword, user.password)) {
    return next(new AppError(`old password incorrect`, 401));
  } else {
    req.body.newPassword = bcrypt.hashSync(req.body.newPassword, 8);
    // creating the new password
    await User.findOneAndUpdate(
      { _id: userPayload.userId },
      { password: req.body.newPassword, passwordChangedAt: Date.now() }
    );
    // generating token
    let token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRET_KEY_TOKEN
    );
    res.json({ message: "password changed successfully", newToken: token });
  }
};

// protect the routes
const protectedRoutes = async (req, res, next) => {
  let token = req.headers.token;
  let userPayload = null;
  // verifying token
  jwt.verify(token, process.env.SECRET_KEY_TOKEN, (err, payload) => {
    if (err) return next(new AppError(`invalid token`, 401));
    userPayload = payload;
  });
  // check the id in the token is right
  let user = await User.findById(userPayload.userId);

  if (!user) return next(new AppError(`user not found`));
  if (user.passwordChangedAt) {
    // setting the time of password change with seconds
    let time = parseInt(user.passwordChangedAt.getTime() / 1000);
    // check if the time of password change is greater than the time of generating of token
    if (time > userPayload.iat)
      return next(new AppError(`invalid token ....please login again`, 401));
  }
  req.user = userPayload;
  next();
};

// check the role
const allowedTo = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      return next(new AppError(`you are not allowed to do this action`, 401));
    }
  };
};
export {
  signUp,
  login,
  changePassword,
  protectedRoutes,
  addUser,
  allowedTo,
  getUsers,
  updateUser,
  deleteUser,
};
