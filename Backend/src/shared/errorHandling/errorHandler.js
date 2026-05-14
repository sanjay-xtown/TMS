import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (err, res) => {
  let { statusCode = 500, message = 'Something went wrong' } = err;

  // Log error for debugging
  console.error(`[ERROR] ${statusCode} - ${message}`);
  if (statusCode === 500) console.error(err.stack);

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    return res.status(statusCode).json({
      status: 'fail',
      statusCode,
      message,
    });
  }

  // Handle Sequelize Errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = err.errors.map(e => e.message).join(', ');
  }

  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    statusCode,
    message,
  });
};
