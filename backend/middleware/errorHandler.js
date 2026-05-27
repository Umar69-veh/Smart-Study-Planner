const errorHandler = (err, req, res, next) => {
  const statusCode = err?.statusCode || err?.status || 500;

  // Try to capture the most useful error message shape
  const message =
    err?.message ||
    err?.error ||
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    "Internal Server Error";

  console.error(`[${new Date().toISOString()}] Error: ${message}`);
  if (err?.stack) console.error(err.stack);
  else console.error(err);

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err?.stack }),
  });
};


const notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

module.exports = { errorHandler, notFound };
