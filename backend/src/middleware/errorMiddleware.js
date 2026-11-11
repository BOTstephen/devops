export const notFound = (req, res) => res.status(404).json({ success: false, message: 'Route not found', error: null });
export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || (err.name === 'ValidationError' ? 422 : err.code === 11000 ? 409 : 500);
  const message = status === 500 && process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  res.status(status).json({ success: false, message, error: status === 500 && process.env.NODE_ENV === 'production' ? null : err.name });
};
