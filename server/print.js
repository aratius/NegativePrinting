const http = require("http");

module.exports = (text, config) => {
  const req = http.request(config);
  req.write(text);
  req.end();
};