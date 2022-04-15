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

      resDetails.appendChild(reservationNumber);
      resDetails.appendChild(flightCode);
      resDetails.appendChild(flightLength);
      resDetails.appendChild(seatNumber);
      resDetails.appendChild(luggage);

      reservation.appendChild(title);
      reservation.appendChild(resDetails);

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

  if(tokenData.isAdmin){
    // account is actually administrative, go to admin panel
    window.location.replace("/admin-panel.html");
    return;
  }

  console.log(userInfo);
  var userId = tokenData.userId;
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
}

window.addEventListener("load", () => {user()})
