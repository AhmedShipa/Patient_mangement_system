export const globalError = (err, req, res, next) => {
  let code = err.statusCode || 500;
  res
    .status(code)
    .json({ message: "error", message: err.message, code, error: err.stack });
};
