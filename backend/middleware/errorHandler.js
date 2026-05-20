const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

const notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

module.exports = { errorHandler, notFound };
