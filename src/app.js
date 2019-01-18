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

const formatComment = function(data) {
  let formattedData = "";
  formattedData += "Name:" + data.name + NEW_LINE;
  formattedData += "Comment:" + data.comment + NEW_LINE;
  formattedData += "DateTime:" + data.dateTime + NEW_LINE;
  return formattedData + separator;
};

const handleComments = function(req, res, comments, data) {
  let parsedComments = JSON.parse(comments);
  parsedComments.unshift(data);
  storeCommentsToFile(JSON.stringify(parsedComments));
  appendToGuestBook(req, res, parsedComments.map(formattedComments).join(""));
};

const formattedComments = comment => {
  return formatComment(comment).replace(/\+/g, " ");
};

const guestBook = (req, res) => {
  let data = parseData(req.body);
  data.dateTime = new Date().toLocaleString();
  fs.readFile("./public/comments.json", (err, comments) => {
    handleComments(req, res, comments, data);
  });
};

const appendToGuestBook = function(req, res, commentLog) {
  fs.readFile("./public/guestBook.html", (err, content) => {
    content += commentLog;
    sendResponse(res, content, 200);
  });
};

const storeCommentsToFile = function(comment) {
  fs.writeFile("./public/comments.json", comment, err => {});
};

app.use(readBody);
app.use(logRequest);
app.post("/guestBook.html", guestBook);
app.use(home);

// Export a function that can act as a handler

module.exports = app.handleRequest.bind(app);
