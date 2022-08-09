function resError(message) {
  return {
    message,
    ok: 0,
  };
}

module.exports = { resError };
