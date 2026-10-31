function errorHandler(err, req, res, next) {
  console.error(err.stack);

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
}

module.exports = errorHandler;
