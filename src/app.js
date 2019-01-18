const fs = require("fs");
const App = require("./frameWork");
const app = new App();
const NEW_LINE = "<br>";
const separator = "<hr>";

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

const parseData = text => {
  let args = {};
  const splitKeyValue = pair => pair.split("=");
  const assignKeyValueToArgs = ([key, value]) => (args[key] = value);
  text
    .split("&")
    .map(splitKeyValue)
    .forEach(assignKeyValueToArgs);
  return args;
};

const appendData = function(path, data) {
  fs.appendFile(path, data, err => {
    if (err) throw err;
    return;
  });
};

const formatComment = function(data) {
  let formattedData = "";
  formattedData += "Name:" + data.name + NEW_LINE;
  formattedData += "Comment:" + data.comment + NEW_LINE;
  formattedData += "DateTime:" + data.dateTime + NEW_LINE;
  return formattedData + separator;
};

const guestBook = (req, res) => {
  let data = parseData(req.body);
  data.dateTime = new Date();
  data = formatComment(data);
  let path = "./public/guestBook.html";
  appendData(path, data);
  fs.readFile(path, function(err, contents) {
    if (err) {
      sendResponse(res, "NOT FOUND", 404);
      return;
    }
    res.write(contents);
    res.end();
  });
};

app.use(readBody);
app.use(logRequest);
app.post("/guestBook.html", guestBook);
app.use(home);

// Export a function that can act as a handler

module.exports = app.handleRequest.bind(app);
