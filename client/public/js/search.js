/**
 * app.js
 *
 * for Travel Guide online application
 */

function f(){
  const apiOrigin = `http://${window.location.hostname}:3000`

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

  window["displayFlights"] = displayFlights;

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
}

window.addEventListener("load", () => {f()});
