function HttpError(url, status, statusText, options) {
  this.message = statusText;
  this.stack = new Error().stack;
  this.status = status;
  this.url = url;
  this.options = options;
}
HttpError.prototype = Object.create(Error.prototype);
HttpError.prototype.name = 'HTTPError';
HttpError.prototype.message = '';
HttpError.prototype.constructor = HttpError;

export default HttpError;
