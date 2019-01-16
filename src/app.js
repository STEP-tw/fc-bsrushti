const fs = require("fs");

const app = (req, res) => {
  if (req.url == "/") {
    req.url = "/index.html";
  }
  fs.readFile("./src" + req.url, function(err, contents) {
    if (err) {
      return;
    }
    res.write(contents);
    res.end();
  });
  sendNotFound(req, res);
};

const sendNotFound = (req, res) => {
  res.statusCode = 404;
  res.write("Not Found");
  res.end();
};

// Export a function that can act as a handler

module.exports = app;
