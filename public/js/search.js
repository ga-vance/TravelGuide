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

  let travelForm = document.querySelector("#search-bar");

  travelForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    let origin = travelForm.origin.value;
    let destination = travelForm.destination.value;
    let destTime = travelForm["depart-time"].value;
    history.pushState({}, "", `/search.html?origin=${origin}&destination=${destination}&depart-date=${destTime}`);
  });
}

window.addEventListener("load", () => {f()});
