/**
 * app.js
 *
 * for Travel Guide online application
 */

async function f(){
  const apiOrigin = `http://${window.location.hostname}:3000`
  var possibleOrigins = [], possibleDestinations = [];

  function displayFlights(flightList){
    // clear container
    document.querySelector("#main").replaceChildren();

    for(flight of flightList){
      var flightResult = document.createElement("div");
      flightResult.classList.add("flight-result");

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
    for(var item of autofillItems){
      // ensure autocomplete values follow existing input
      if(input.value.toUpperCase() !== item.substr(0, input.value.length)) continue

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

  let travelForm = document.querySelector("#search-bar");

  // if query exists, populate search menus with it
  if(!!window.location.search){
    var urlParams = new URLSearchParams(window.location.search);
    travelForm.origin.value = urlParams.get("origin");
    travelForm.destination.value = urlParams.get("destination");
    travelForm["depart-date"].value = urlParams.get("depart-date");
    performSearch(urlParams.get("origin"), urlParams.get("destination"), urlParams.get("depart-date"));
  }

  travelForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    let origin = travelForm.origin.value;
    let destination = travelForm.destination.value;
    let destTime = travelForm["depart-date"].value;
    let url = `/search.html?origin=${origin}&destination=${destination}&depart-date=${destTime}`;
    history.pushState({}, "", url);
    performSearch(origin, destination, destTime);
  });

  // get possible airport codes that can be selected from
  var routeJson = await fetch(`${apiOrigin}/routes`).then((res) => res.json());

  var routeData = routeJson.data;
  for(var route of routeData){
    if(!possibleOrigins.includes(route.origin))
      possibleOrigins.push(route.origin);
    if(!possibleDestinations.includes(route.destination))
      possibleDestinations.push(route.destination);
  }

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

window.addEventListener("load", () => {f()});
