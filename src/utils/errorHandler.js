class HTTPError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.custom = true;
  }
}

module.exports = HTTPError;
