/**
 * flight.js
 */

async function flight(){
  const apiOrigin = `http://${window.location.hostname}:3000`
  // fetch information about current flight
  var urlParams = new URLSearchParams(window.location.search);
  var flightId = urlParams.get("flightId");

  var flightData = await fetch(`${apiOrigin}/flights/${flightId}`, {
    method: "GET",
  }).then((res) => res.json());

  console.log(flightId, flightData);
}

window.addEventListener("load", () => {flight()});
