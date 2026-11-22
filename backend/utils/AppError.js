// An error with an HTTP status and a message that is safe to show the user.
class AppError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details; // e.g. { field: "message" } for form errors
  }
}
module.exports = AppError;
