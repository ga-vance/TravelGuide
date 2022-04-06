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

  // if query exists, populate search menus with it
  if(!!window.location.search){
    var urlParams = new URLSearchParams(window.location.search);
    travelForm.origin.value = urlParams.get("origin");
    travelForm.destination.value = urlParams.get("destination");
    travelForm["depart-date"].value = urlParams.get("depart-date");
  }

  travelForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    let origin = travelForm.origin.value;
    let destination = travelForm.destination.value;
    let destTime = travelForm["depart-date"].value;
    let url = `/search.html?origin=${origin}&destination=${destination}&depart-date=${destTime}`;
    console.log(url);
    history.pushState({}, "", url);
  });
}

window.addEventListener("load", () => {f()});
