const NEW_LINE = "<br>";
const separator = "<hr>";

const formatComment = function(data) {
  let formattedData = "";
  formattedData += "Name:" + data.name + NEW_LINE;
  formattedData += "Comment:" + data.comment + NEW_LINE;
  formattedData += "DateTime:" + data.dateTime + NEW_LINE;
  return formattedData + separator;
};

const formattedComments = comment => {
  return formatComment(comment).replace(/\+/g, " ");
};

module.exports = { formattedComments };
