function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Cannot find ${req.originalUrl}`,
  });
}

module.exports = notFoundHandler;