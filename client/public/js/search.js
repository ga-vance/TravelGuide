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
      airportCode.innerText = flight["route"]["origin"]; // this value may change
      var datetime = document.createElement("i");
      datetime.innerText = flight["departure_datetime"];

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
      airportCode.innerText = flight["route"]["destination"]; // this value may change
      var datetime = document.createElement("i");
      datetime.innerText = flight["arrival_datetime"];
      arrivalDiv.appendChild(header);
      arrivalDiv.appendChild(airportCode);
      arrivalDiv.appendChild(datetime);

      flightResult.appendChild(arrivalDiv);
      document.querySelector("#main").appendChild(flightResult);
    }
  }

  window["displayFlights"] = displayFlights;

  function performSearch(origin, destination, destTime){
    fetch(`${apiOrigin}/flight`, {
      method: "GET",
      body: JSON.stringify({
        DepartureDate: destTime,
        Origin: origin,
        Destination: destination,
      }),
    });
  }

  // test possible cross-origin stuff:
  fetch(`http://${window.location.hostname}:3000/test`, {method: "GET"})
  .then((res) => res.json())
  .then(console.log);

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
