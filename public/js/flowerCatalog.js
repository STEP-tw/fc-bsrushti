const wait = function() {
  let jar = document.getElementById("jar").style;
  jar.visibility = "hidden";
  setTimeout(() => (jar.visibility = "visible"), 1000);
};
