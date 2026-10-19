export function notFoundHandler(req, res, next) {
  res.status(404).json({ message: "Not found" });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.statusCode || err.status || 500;
  const message =
    status === 500 ? "Internal server error" : err.message || "Error";

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({ message });
}
