/**
 * app.js
 *
 * for Travel Guide online application
 */

async function search(){
  const apiOrigin = `http://${window.location.hostname}:3000`
  var possibleOrigins = {}, possibleDestinations = {};

  function displayFlights(flightList){
    // clear container
    document.querySelector("#main").replaceChildren();

    for(flight of flightList){
      var flightResult = document.createElement("a");
      flightResult.classList.add("flight-result");
      flightResult.href = `/flight.html?${urlParams}&flightId=${flight.flightnumID}`;

      // display departure info
      var destDiv = document.createElement("div");

      var header = document.createElement("h2");
      header.innerText = "Departure";
      var headerelement = document.createElement("h2");
      headerelement.innerText = "Departure";
      var airportCode = document.createElement("p");
      airportCode.innerText = flight["origin"]; // this value may change
      var datetime = document.createElement("i");
      datetime.innerText = `${flight["departure_date"].substr(0, 10)} ${flight["departure_time"]}`;

      destDiv.appendChild(header);
      destDiv.appendChild(airportCode);
      destDiv.appendChild(datetime);

      flightResult.appendChild(destDiv);

      var plane = document.createElement("h1");
      plane.innerText = '✈️';
      flightResult.appendChild(plane);

      // display departure info
      var arrivalDiv = document.createElement("div");

      var header = document.createElement("h2");
      header.innerText = "Arrival";
      var airportCode = document.createElement("p");
      airportCode.innerText = flight["destination"]; // this value may change
      var datetime = document.createElement("i");
      datetime.innerText = `${flight["arrival_date"].substr(0,10)} ${flight["arrival_time"]}`;
      arrivalDiv.appendChild(header);
      arrivalDiv.appendChild(airportCode);
      arrivalDiv.appendChild(datetime);

      flightResult.appendChild(arrivalDiv);
      document.querySelector("#main").appendChild(flightResult);
    }
  }

  function handleAutocomplete(input, autofillItems){
    var parentContainer = document.querySelector(`#${input.name}-container .autocomplete`);
    var itemContainer = parentContainer.querySelector(".autocomplete-items");

    if(itemContainer === null){ // container not present
      itemContainer = document.createElement("div");
      itemContainer.classList.add("autocomplete-items");
      parentContainer.appendChild(itemContainer);
    }

    itemContainer.replaceChildren();
    for(var item of Object.keys(autofillItems)){
      // ensure autocomplete values follow existing input
      if(input.value.toUpperCase() !== item.substr(0, input.value.length).toUpperCase()) continue

      let autoItem = document.createElement("div");
      autoItem.classList.add("autocomplete-item");
      autoItem.innerText = item;
      autoItem.addEventListener("click", () => {
        console.log("clicked", autoItem.innerText);
        input.value = autoItem.innerText;
        autoItem.parentElement.parentElement.removeChild(autoItem.parentElement);
      });

      itemContainer.appendChild(autoItem);
    }
  }

  async function performSearch(origin, destination, destTime){
    var query = `departure_date=${destTime}&origin=${origin}&destination=${destination}`;
    var searchData = await fetch(`${apiOrigin}/flights?${query}`, {
      method: "GET",
    }).then((res) => res.json());

    displayFlights(searchData.data);
  }

  // if mobile, allow for search menu toggling
  if(window.innerWidth < 800){
    document.querySelector("#search-icon").addEventListener("click", () => {
      document.querySelector("#search-bar").classList.toggle("hidden");
    });
  }else{
    document.querySelector("#search-icon").classList.add("disabled");
    document.querySelector("#search-bar").classList.remove("hidden");
  }

  // get possible airport codes that can be selected from
  var routeJson = await fetch(`${apiOrigin}/routes`).then((res) => res.json());

  var routeData = routeJson.data;
  for(var route of routeData){
    possibleOrigins[route.originCity] = route.origin;
    possibleDestinations[route.destinationCity] = route.destination;
  }

  let travelForm = document.querySelector("#search-bar");

  // if query exists, populate search menus with it
  if(!!window.location.search){
    var urlParams = new URLSearchParams(window.location.search);
    // get city names
    for(var originName of Object.keys(possibleOrigins)){
      if(possibleOrigins[originName] !== urlParams.get("origin")) continue;
      travelForm.origin.value = originName;
    }

    for(var destinationName of Object.keys(possibleDestinations)){
      if(possibleDestinations[destinationName] !== urlParams.get("destination")) continue;
      travelForm.destination.value = destinationName;
    }

    travelForm["depart-date"].value = urlParams.get("depart-date");
    if(window.location.pathname === "/search.html")
      performSearch(urlParams.get("origin"), urlParams.get("destination"), urlParams.get("depart-date"));
  }

  travelForm.addEventListener("submit", (evt) => {
    evt.preventDefault();

    let originName = travelForm.origin.value;
    let destinationName = travelForm.destination.value;
    let destTime = travelForm["depart-date"].value;

    // get the airport codes
    let origin = possibleOrigins[originName];
    if(origin === undefined){
      alert(`currently not serving flights from ${originName}`);
      travelForm.origin.value = "";
      return;
    }

    let destination = possibleOrigins[destinationName];
    if(destination === undefined){
      alert(`currently not serving flights to ${destinationName}`);
      travelForm.destination.value = "";
      return;
    }

    // remove "flight" class from main if necessary
    document.querySelector("#main").classList.remove("flight");

    // if on homepage
    if(window.location.pathname === "/" || window.location.pathname === "/index.html"){
      document.querySelector("#navbar").classList.remove("home");
      var bg = document.querySelector("#plane-bg");
      bg.classList.add("search");
      setTimeout(() => {
        bg.parentElement.removeChild(bg);
      }, 1000)
    }

    // if using mobile device
    if(window.innerWidth < 800){
      document.querySelector("#search-icon").classList.remove("disabled");
      document.querySelector("#search-bar").classList.add("hidden");
    }

    let url = `/search.html?origin=${origin}&destination=${destination}&depart-date=${destTime}`;
    history.pushState({}, "", url);
    urlParams = new URLSearchParams(window.location.search);
    performSearch(origin, destination, destTime);
  });

  // handle autocomplete stuff
  var originInput = document.querySelector("input[name='origin']");
  originInput.addEventListener("focus", () => {
    handleAutocomplete(originInput, possibleOrigins);
  });
  originInput.addEventListener("keyup", () => {
    handleAutocomplete(originInput, possibleOrigins);
  });

  var destInput = document.querySelector("input[name='destination']");
  destInput.addEventListener("focus", () => {
    handleAutocomplete(destInput, possibleDestinations);
  });
  destInput.addEventListener("keyup", () => {
    handleAutocomplete(destInput, possibleDestinations);
  });

  var originContainer = document.querySelector("#origin-container");
  var destContainer = document.querySelector("#destination-container");

  window.addEventListener("click", (evt) => {
    var parentElement = evt.target.closest(".search-component");
    if(!parentElement || parentElement.id !== "origin-container"){
      var autofillContainer = originContainer.querySelector(".autocomplete-items");
      if(!!autofillContainer) autofillContainer.parentElement.removeChild(autofillContainer);
    }

    if(!parentElement || parentElement.id !== "destination-container"){
      var autofillContainer = destContainer.querySelector(".autocomplete-items");
      if(!!autofillContainer) autofillContainer.parentElement.removeChild(autofillContainer);
    }
  });
}

window.addEventListener("load", () => {search()});
