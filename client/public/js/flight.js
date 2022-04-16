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

  // create reservations as necesssary
  var reserveForm = document.querySelector("#reserve-section");
  reserveForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    var luggage = reserveForm.luggage.value;
    var flightNumId = flightId;
    var customerID = tokenData.userId;

    // select an unused seat
    var seatData = await fetch(`${apiOrigin}/flightreservation/${flightNumId}`).then(res => res.json());
    var takenSeats = [];
    for(var reservation of seatData.data){
      takenSeats.push(reservation.seat_number);
    }

    var seatNumber;

    do{
      var seatNum, offset, range, seatLetters = "ABCDEF"
      var seatLetter = seatLetters[Math.floor(Math.random() * seatLetters.length % seatLetters.length)];
      switch(reserveForm.seat.value){
        case("econ-front"):
          offset = 18;
          range = 10;
          seatNum = offset + Math.floor(Math.random() * range % range);
          break;
        case("econ-mid"):
          offset = 28;
          range = 10;
          seatNum = offset + Math.floor(Math.random() * range % range);
          break;
        case("econ-back"):
          offset = 38;
          range = 10;
          seatNum = offset + Math.floor(Math.random() * range % range);
          break;
        case("busi-front"):
          offset = 0;
          range = 6;
          seatNum = offset + Math.floor(Math.random() * range % range);
          break;
        case("busi-mid"):
          offset = 6;
          range = 6;
          seatNum = offset + Math.floor(Math.random() * range % range);
          break;
        case("busi-back"):
          offset = 12;
          range = 6;
          seatNum = offset + Math.floor(Math.random() * range % range);
          break;
      }

      seat_number = seatLetter + seatNum;
    }while(takenSeats.includes(seat_number));

    var stats = await fetch(`${apiOrigin}/reservation`, {
      method: "POST",
      body: JSON.stringify({flightNumId, customerID, seat_number, luggage}),
      headers:{
        "Content-Type": "application/json",
      },
    }).then(res => res.json());

    var formButton = reserveForm.querySelector("button");

    if(stats.failed){
      console.error("[error] failed to reserve seat");
      console.error(stats.message);
      formButton.innerText = "Reservation failed... try again?";
      return;
    }

    formButton.innerText = "You're booked! ✅";
    formButton.disabled = true;
  });

  // remove admin panel if user is not an admin.
  var adminPanel = document.querySelector("#admin-control");
  if(!tokenData.isAdmin){
    adminPanel.parentElement.removeChild(adminPanel);
  }else{
    // add button functionality to delete the flight
    var deleteButton = adminPanel.querySelector("button");
    deleteButton.addEventListener("click", async () => {
      if(deleteButton.innerText === "Delete Flight?"){
        deleteButton.innerText = "Confirm Deletion?";
      }else if(deleteButton.innerText === "Confirm Deletion?"){
        var stats = await fetch(`${apiOrigin}/flights/${flightId}`, {
          method: "DELETE",
        }).then(res => res.json());
        if(!stats.failed){
          window.location.href = "/admin-panel.html";
          return;
        }

        console.error("[error] could not delete flight");
        console.error(stats.message);
      }
    });
  }
}

window.addEventListener("load", () => {flight()});
