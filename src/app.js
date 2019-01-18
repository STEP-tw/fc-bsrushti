const fs = require("fs");
const App = require("./frameWork");
const app = new App();

const readFile = (req, res) => {
  let fileName = req.url;
  if (fileName == "/") fileName = "/index.html";
  fs.readFile("./public" + fileName, function(err, contents) {
    if (err) {
      sendResponse(res, "NOT FOUND", 404);
      return;
    }
    sendResponse(res, contents, 200);
  });
};

const sendResponse = function(res, content, status) {
  res.statusCode = status;
  res.write(content);
  res.end();
};

const readBody = (req, res, next) => {
  let content = "";
  req.on("data", chunk => (content += chunk));
  req.on("end", () => {
    req.body = content;
    console.log("readBody:", req.body);
    next();
  });
};

const logRequest = (req, res, next) => {
  console.log(req.method, req.url);
  console.log("headers =>", JSON.stringify(req.headers, null, 2));
  console.log("body =>", req.body);
  next();
};

const home = (req, res) => {
  readFile(req, res);
};

const guestBook = (req, res) => {
  sendResponse(res, req.body, 200);
};

app.use(readBody);
app.use(logRequest);
app.post("/log", guestBook);
app.use(home);

// Export a function that can act as a handler

module.exports = app.handleRequest.bind(app);
