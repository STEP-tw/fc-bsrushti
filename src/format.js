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
    createTd(new Date(user.dateTime).toLocaleString())
  ].join("");

  return createTable(createTableBody(createRow(tableRow)));
};

const formattedComments = comment => {
  return format(comment).replace(/\+/g, " ");
};

module.exports = { formattedComments };
