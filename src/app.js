const App = require("./frameWork");
const fs = require("fs");
const { sendResponse, parseData } = require("./utility");
const { formattedComments } = require("./format");

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

const readBody = (req, res, next) => {
  let content = "";
  req.on("data", chunk => (content += chunk));
  req.on("end", () => {
    req.body = content;
    next();
  });
};

const logRequest = (req, res, next) => {
  console.log("headers =>", JSON.stringify(req.headers, null, 2));
  console.log("body =>", req.body);
  next();
};

const appendToGuestBook = function(req, res, commentLog) {
  fs.readFile("./public/guestBook.html", (err, content) => {
    content += commentLog;
    sendResponse(res, content, 200);
  });
};

const storeCommentsToFile = function(comment) {
  fs.writeFile("./public/json/comments.json", comment, err => {});
};

const handleComments = function(req, res, comments, data) {
  let parsedComments = JSON.parse(comments);
  parsedComments.unshift(data);
  storeCommentsToFile(JSON.stringify(parsedComments));
  appendToGuestBook(req, res, parsedComments.map(formattedComments).join(""));
};

const home = (req, res) => {
  readFile(req, res);
};

const guestBook = (req, res) => {
  let data = parseData(req.body);
  data.dateTime = new Date().toLocaleString();
  fs.readFile("./public/json/comments.json", (err, comments) => {
    handleComments(req, res, comments, data);
  });
};

app.use(readBody);
app.use(logRequest);
app.post("/guestBook.html", guestBook);
app.use(home);

// Export a function that can act as a handler

module.exports = app.handleRequest.bind(app);
