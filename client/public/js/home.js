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

  let travelForm = document.querySelector("#search-bar");

  travelForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    let origin = travelForm.origin.value;
    let destination = travelForm.destination.value;
    let destTime = travelForm["depart-date"].value;
    let url = `/search.html?origin=${origin}&destination=${destination}&depart-date=${destTime}`;
    console.log(url);
    history.pushState({}, "", url);
  });

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
