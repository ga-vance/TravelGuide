/**
 * home.js
 */

function f(){
  document.querySelector("#search-bar").classList.remove("hidden");
  document.querySelector("#search-icon").classList.add("disabled");

  document.querySelector("#search-bar").addEventListener("submit", (evt) => {
    evt.preventDefault();
    document.querySelector("#navbar").classList.remove("home");
    document.querySelector("#plane-bg").classList.add("search");

    if(window.innerWidth < 800){
      document.querySelector("#search-icon").classList.remove("disabled");
      document.querySelector("#search-bar").classList.add("hidden");
    }
  });
}

window.addEventListener("load", () => {f()});
