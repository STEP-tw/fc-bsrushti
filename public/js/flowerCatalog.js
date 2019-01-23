const wait = function() {
  let jar = document.getElementById("jar").style;
  jar.visibility = "hidden";
  setTimeout(() => (jar.visibility = "visible"), 1000);
};

const initialize = function() {
  document.getElementById("jar").onclick = wait;
};

window.onload = initialize;
