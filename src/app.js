const App = require("./frameWork");
const fs = require("fs");
const comments = require("../public/comments");
const { sendResponse, parseData } = require("./utility");
const { formattedComments } = require("./format");

const app = new App();

const getURL = url => {
  if (url == "/") return "./public/index.html";
  return `./public${url}`;
};

const readFile = (req, res) => {
  let fileName = getURL(req.url);
  fs.readFile(fileName, function(err, contents) {
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

const storeCommentsToFile = function(comment) {
  fs.writeFile("./public/comments.json", comment, err => {});
};

const handleComments = function(req, res) {
  let data = parseData(req.body);
  data.dateTime = new Date();
  comments.unshift(data);
  storeCommentsToFile(JSON.stringify(comments));
  renderGuestBook(req, res);
};

const home = (req, res) => {
  readFile(req, res);
};

const reloadComments = function(req, res) {
  sendResponse(res, JSON.stringify(comments), 200);
};

const renderGuestBook = function(req, res) {
  fs.readFile("./public/guestBook.html", "utf8", (err, content) => {
    let commentLog = comments.map(formattedComments).join("");
    let guestBookHTML = content.replace("__COMMENTS__", commentLog);
    sendResponse(res, guestBookHTML, 200);
  });
};

app.use(readBody);
app.use(logRequest);
app.get("/guestBook.html", renderGuestBook);
app.post("/guestBook.html", handleComments);
app.get("/comments", reloadComments);
app.use(home);

// Export a function that can act as a handler

module.exports = app.handleRequest.bind(app);
