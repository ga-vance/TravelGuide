/**
 * app.js
 *
 * for Travel Guide online application
 */

function f(){
  // if mobile, allow for search menu toggling
  if(window.innerWidth < 800){
    document.querySelector("#search-icon").addEventListener("click", () => {
      document.querySelector("#search-bar").classList.toggle("hidden");
    });
  }else{
    document.querySelector("#search-icon").classList.add("disabled");
    document.querySelector("#search-bar").classList.remove("hidden");
  }
}

window.addEventListener("load", () => {f()});
