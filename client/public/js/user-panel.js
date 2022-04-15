/**
 * user-panel.js
 */

async function user(){
  const apiOrigin = `http://${window.location.hostname}:3000`

  function showReservations(reserveList){
    document.querySelector("#reservations").replaceChildren();

    if(reserveList.length === 0){
      document.querySelector("#reservations").innerText = "No reservations made yet!";
      return;
    }

    for(var res of reserveList){
      var reservation = document.createElement("div");
      reservation.classList.add("reservation");
      var title = document.createElement("h1");
      title.innerText = "Boarding Pass";
      var resDetails = document.createElement("div");
      resDetails.classList.add("reservation-details");

      var reservationNumber = document.createElement("i");
      reservationNumber.innerText = `Reservation No. ${res.reservation_number}`;
      var flightCode = document.createElement("h2");
      flightCode.innerText = `Flight: ${res.flightNumber}`;
      var flightLength = document.createElement("p");
      flightLength.innerText = `🛫: ${res.departure_date.substr(0,10)}@${res.departure_time}`;
      var seatNumber = document.createElement("h3");
      seatNumber.innerText = `Seat Number: ${res.seat_number}`;
      var luggage = document.createElement("h3");
      luggage.innerText = `Luggage: 1 Carry-On, ${res.luggage || 0} Luggage`;

      var yeet = document.createElement("h2");
      yeet.classList.add("yeet-reservation");
      yeet.innerText = "🗑️";
      yeet.addEventListener("click", async (evt) => {
        if(evt.target.innerText !== "🗑️?"){
          evt.target.innerText = "🗑️?";
          return;
        }

        evt.target.resNumber = res.reservation_number;
        var stats = await fetch(`${apiOrigin}/reservation/${evt.target.resNumber}`, {
          method: "DELETE",
        }).then(resp => resp.json());

        if(stats.failed){
          console.error("[error] failed to delete reservation");
          yeet.innerText = "Failed, try again?";
          return;
        }

        var e = evt.target.parentElement;
        e.parentElement.removeChild(e);
      });

      resDetails.appendChild(reservationNumber);
      resDetails.appendChild(flightCode);
      resDetails.appendChild(flightLength);
      resDetails.appendChild(seatNumber);
      resDetails.appendChild(luggage);

      reservation.appendChild(title);
      reservation.appendChild(resDetails);

      reservation.appendChild(yeet);

      document.querySelector("#reservations").appendChild(reservation);
    }
  }

  // specify the element to log out
  document.querySelector("#logout").addEventListener("click", () => {
    localStorage.removeItem("sesstoken");
    window.location.href = "/";
  });

  // fetch current user information and populate page with that data
  // get userID from token
  var token = localStorage.getItem("sesstoken");
  var tokenData;
  try{
    tokenData = JSON.parse(atob(token.split('.')[1]));
  }catch(err){
    // token is malformed, go to login page
    console.error("[error] missing or malformed token");
    window.location.replace("/login.html");
    return;
  }

  var userId = tokenData.userId;

  if(tokenData.isAdmin && window.location.search.indexOf("view") > 0){
    // admin is viewing user account
    var urlParams = new URLSearchParams(window.location.search);
    userId = urlParams.get("view"); 
  }else if(tokenData.isAdmin){
    // account is actually administrative, go to admin panel
    window.location.replace("/admin-panel.html");
    return;
  }

  var userJson = await fetch(`${apiOrigin}/users/${userId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  }).then((res) => {return res.json();});

  if(userJson.failed || userJson.data.length == 0){
    console.error("[error] cannot access user panel");
    console.error(userJson.message || "[error] blank statement");
    window.location.href = "/login.html";
    return;
  }

  var userInfo = userJson.data[0];

  var updateAccount = document.querySelector("#update-account");
  updateAccount.name.value = userInfo.name;
  updateAccount.username.value = userInfo.username;
  updateAccount["credit-number"].value = `************${userInfo.creditcardnumber.substr(-4)}`;
  updateAccount["credit-expire"].value = userInfo.creditcardExpiry;

  // get reservations
  var reserveStats = await fetch(`${apiOrigin}/reservation/${userId}`, {
    headers:{
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.json());

  if(reserveStats.failed){
    console.error("[error] failed to retreive reservation details");
    console.error(reserveStats.message);
  }else{
    showReservations(reserveStats.data);
  }

  // get frequent flier information for user
  var freqFlierInfo = await fetch(`${apiOrigin}/frequentFlier/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.json());

  if(freqFlierInfo.failed){
    console.error("[error] failed to retrieve frequent flyer information for user");
    console.error(reqFlierInfo.message);
  }else{
    document.querySelector("#current-freq-fliers").replaceChildren();
    for(var freqFlier of freqFlierInfo.data){
      var listItem = document.createElement("p");
      listItem.innerText = `${freqFlier.airline} : ${freqFlier.tier}`;
      document.querySelector("#current-freq-fliers").appendChild(listItem);
    }
  }

  // allow for user info updates
  document.querySelector("#update-account").addEventListener("submit", async (evt) => {
    evt.preventDefault();
    var form = evt.target;

    // get user values to update
    var name = form.name.value;
    var username = form.username.value;

    if(form.password.value !== form["confirm-password"].value){
      console.log("[error] passwords do not match");
      return;
    }

    var password = form.password.value !== "*********" ? userInfo.password : form.password.value;
    var creditcardnumber = form["credit-number"].value.includes("*") ? userInfo.creditcardnumber : form["credit-number"].value;
    var creditcardExpiry = form["credit-expire"].value;

    var stats = await fetch(`${apiOrigin}/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify({
        name, username, password, creditcardnumber, creditcardExpiry,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }, 
    }).then(res => res.json());

    if(stats.failed){
      console.error("[error] failed to update user account");
      console.error(stats.message);
      document.querySelector("input[value='Update Account']").innerText = "Failed: Please Try Again"
      return
    }

    window.location.reload(false);
  })

  // allow for account deletion
  document.querySelector("#del-account").addEventListener("click", async (evt) => {
    evt.preventDefault();

    if(evt.target.value !== "Confirm Deletion?"){
      evt.target.value = "Confirm Deletion?";
      return;
    }

    var stats = await fetch(`${apiOrigin}/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => res.json());

    if(stats.failed){
      console.error("[error] Failed to delete account");
      console.error(stats.message);
      evt.target.value = "Failed to delete: try again?";
      return;
    }

    window.location.href = "/index.html";
  });

  // allow for frequent flier status creation
  document.querySelector("#update-freq-flyers").addEventListener("submit", async (evt) => {
    evt.preventDefault();
    var form = evt.target;

    var airline = form.airline.value;
    var tier = form.tier.value;

    var stats = await fetch(`${apiOrigin}/frequentFlier`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({customerID: userId, airline, tier}),
    }).then(res => res.json());

    var button = form.querySelector("input[type='submit']");
    if(stats.failed){
      console.error("[error] failed to add to frequent flier list");
      console.error(stats.message);
      button.innerText = "Failed: Try Again?";
      return;
    }

    window.location.reload(false);
  });
}

window.addEventListener("load", () => {user()})
