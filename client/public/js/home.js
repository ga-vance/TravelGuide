/**
 * home.js
 */

function f(){
  document.querySelector("#search-bar").classList.remove("hidden");
  document.querySelector("#search-icon").classList.add("disabled");
}

window.addEventListener("load", () => {f()});
