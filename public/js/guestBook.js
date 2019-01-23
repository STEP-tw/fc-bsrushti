const withTag = (tag, text) => `<${tag}>${text}</${tag}>`;

const setStyle = (tag, style, text) =>
  `<${tag} style="${style}">${text}</${tag}>`;

const createTd = text => setStyle("td", "width:30%", text);
const createRow = text => withTag("tr", text);
const createTableBody = text => withTag("tbody", text);
const createTable = text => setStyle("table", "width:50%", text);

const format = function(user) {
  let tableRow = [
    createTd(user.name),
    createTd(user.comment),
    createTd(user.dateTime)
  ].join("");
  return createRow(tableRow);
};

const formattedComments = comment => {
  return format(comment).replace(/\+/g, " ");
};

const reloadComments = function() {
  let url = "/comments";
  fetch(url)
    .then(comments => {
      return comments.json();
    })
    .then(insertComments);
};

const insertComments = function(comments) {
  let row = comments.map(format);
  let table = createTable(createTableBody(row.join("")));
  comments = JSON.stringify(comments);
  document.getElementById("comments").innerHTML = table;
};

const initialize = function() {
  document.getElementById("refresh").onclick = reloadComments;
};

window.onload = initialize;
