/**
 * home.js
 */

function home(){
  document.querySelector("#search-bar").classList.remove("hidden");
  document.querySelector("#search-icon").classList.add("disabled");
}

window.addEventListener("load", () => {home()});
