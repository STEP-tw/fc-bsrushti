const reloadComments = function() {
  let url = "/comments";
  fetch(url)
  .then(comments => comments.text())
  .then(insertComments);
};

const insertComments = function(comments) {
  document.getElementById("comments").innerHTML = comments;
};

const initialize = function() {
  document.getElementById("refresh").onclick = reloadComments;
};

window.onload = initialize;
