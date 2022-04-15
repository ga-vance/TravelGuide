/**
 * flight.js
 */

async function flight(){
  const apiOrigin = `http://${window.location.hostname}:3000`

  // check if user is logged in
  var token = localStorage.getItem("sesstoken");
  if(token === null){
    console.error("[error] not logged in");
    window.location.href = "/login.html";
    return;
  }

  var tokenData = JSON.parse(atob(token.split('.')[1]));

  // fetch information about current flight
  var urlParams = new URLSearchParams(window.location.search);
  var flightId = urlParams.get("flightId");

  var flightJson = await fetch(`${apiOrigin}/flights/${flightId}`, {
    method: "GET",
  }).then((res) => res.json());

  if(flightJson.failed || flightJson.data.length === 0){
    console.error("[error] cannot access flight");
    console.error(flightJson.message || "Returned with no data");
    window.location.replace("/index.html");
    return;
  }

  flightData = flightJson.data[0];

  // populate elements with correct values
  // Departure info
  document.querySelector("#origin .marker-name").innerText = `${flightData.originCity}, ${flightData.originCountry}`;
  document.querySelector("#origin .marker-code").innerText = flightData.originCode;
  document.querySelector("#depart-time").innerText = `Departs on ${flightData.departure_date.substr(0, 10)} @ ${flightData.departure_time}`;
  // Arrival info
  document.querySelector("#destination .marker-name").innerText = `${flightData.destinationCity}, ${flightData.destinationCountry}`;
  document.querySelector("#destination .marker-code").innerText = flightData.destinationCode;
  document.querySelector("#arrive-time").innerText = `Departs on ${flightData.arrival_date.substr(0, 10)} @ ${flightData.arrival_time}`;
  // Flight Info
  document.querySelector("#company-name").innerText = `Managed by: ${flightData.airline}`;
  document.querySelector("#flight-number").innerText = flightData.flightNumber;
  // Aircraft Info
  document.querySelector("#aircraft-number").innerText = `Flying in: ${flightData.model_number}`;
  document.querySelector("#aircraft-ownership").innerText = `Aircraft owned by: ${flightData.owned_by}`;
  // Check to see if user frequently flies with this company
  var userId = tokenData.userId;
  fetch(`${apiOrigin}/frequentFlier/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json())
  .then((data) => {
    for(var freqFlier of data.data){
      if(freqFlier.airline !== flightData.airline) continue;
      document.querySelector("#freq-flier").innerText = `Frequent Flier Status: ${freqFlier.tier}`;
      return
    }
  });

  // Populate restriction information if there exists any
  if(flightData.restriction !== null){
    /// TODO: query restrictions
  }
}

window.addEventListener("load", () => {flight()});
