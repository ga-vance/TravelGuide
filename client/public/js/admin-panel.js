/**
 * admin-panel.js
 */

async function admin(){
  const apiOrigin = `http://${window.location.hostname}:3000`;

  function displayAdmins(adminList){
    document.querySelector("#list-admin").replaceChildren();
    var header = document.createElement("h1");
    header.innerText = "Manage Admins";
    document.querySelector("#list-admin").appendChild(header);

    for(var admin of adminList){
      var adminElement = document.createElement("div");
      adminElement.classList.add("admin");

      var image = document.createElement("h1");
      image.innerText = "👤";

      adminElement.appendChild(image);

      var adminDetails = document.createElement("div");
      adminDetails.classList.add("admin-details");
      var adminName = document.createElement("p");
      adminName.innerText = admin.name;
      var adminId = document.createElement("i");
      adminId.innerText = `User No. ${admin.adminID}`;
      
      adminDetails.appendChild(adminName);
      adminDetails.appendChild(adminId);
      adminElement.appendChild(adminDetails);

      var form = document.createElement("form");
      form.classList.add("admin-account");
      form.id = admin.adminID;

      var usernameDiv = document.createElement("div");
      var usernameLabel = document.createElement("label");
      usernameLabel.for = "username";
      usernameLabel.innerText = "Username";
      var usernameInput = document.createElement("input");
      usernameInput.name = "username";
      usernameInput.type = "text";
      usernameInput.value = admin.username;
      usernameInput.placeholder = "username";

      usernameDiv.appendChild(usernameLabel);
      usernameDiv.appendChild(usernameInput);

      form.appendChild(usernameDiv);

      var passwordDiv = document.createElement("div");
      var passwordLabel = document.createElement("label");
      passwordLabel.for = "password";
      passwordLabel.innerText = "Password";
      var passwordInput = document.createElement("input");
      passwordInput.name = "password";
      passwordInput.type = "password";
      passwordInput.value = admin.password;
      passwordInput.placeholder = "password";

      passwordDiv.appendChild(passwordLabel);
      passwordDiv.appendChild(passwordInput);

      form.appendChild(passwordDiv);

      var updateButton = document.createElement("input");
      updateButton.type = "submit";
      updateButton.value = "Update";
      var deleteButton = document.createElement("button");
      deleteButton.innerText = "Delete";

      form.appendChild(updateButton);
      form.appendChild(deleteButton);

      // add appropriate actions
      deleteButton.addEventListener("click", async (evt) => {
        evt.preventDefault();
        var adminId = evt.target.parentElement.id;

        var stats = await fetch(`${apiOrigin}/admin/${adminId}`, {
          method: "DELETE",
        }).then(res => res.json());

        if(stats.failed){
          console.error("[error] failed to delete admin");
          console.error(stats.message);
          evt.target.innerText = "Failed: Try Again?";
          return;
        }

        var e = evt.target.parentElement.parentElement;
        e.parentElement.removeChild(e);
      });

      form.addEventListener("submit", async (evt) => {
        evt.preventDefault();
        var adminId = evt.target.id;
        var username = evt.target.username.value;
        var password = evt.target.password.value;

        var stats = await fetch(`${apiOrigin}/admin/${adminId}`, {
          method: "PUT",
          headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({username, password}),
        }).then(res => res.json());

        if(stats.failed){
          console.error("[error] failed to update admin user");
          console.error(stats.message);
          evt.target.submit.innerText = "Failed, try again?";
          return;
        }

        evt.target.querySelector("input[type='submit']").value = "Updated ✅";
        evt.target.querySelector("input[type='submit']").disabled = true;
      });

      adminElement.appendChild(form);
      document.querySelector("#list-admin").appendChild(adminElement);
    }
  }

  var token = localStorage.getItem("sesstoken");
  var tokenData;

  try{
    tokenData = JSON.parse(atob(token.split('.')[1]));
    if(tokenData.failed){
      console.error("[error] cannot access admin panel");
      console.error(tokenJson.message);
      window.location.replace("/index.html");
      return;
    }

    if(!tokenData.isAdmin){
      console.error("[error] cannot access admin panel");
      console.error("logged in user is not an admin");
      window.location.replace("/user-panel.html");
      return;
    }
  }catch(err){
    console.error("[error] cannot access admin panel");
    console.error("nonexistent or malformed token");
    window.location.replace("/index.html");
    return;
  }

  // specify the element to log out
  document.querySelector("#logout").addEventListener("click", () => {
    localStorage.removeItem("sesstoken");
    window.location.href = "/";
  });

  // get admin stuff
  var adminDetails = await fetch(`${apiOrigin}/admin`, {
    method: "GET",
    headers:{
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.json());

  if(adminDetails.failed){
    console.error("[error] failed to retrieve administrators");
    console.error(adminDetails.message);
    document.querySelector("list-admin").innerText = "Failed to retrieve, please refresh..."
  }else{
    displayAdmins(adminDetails.data);
  }

  // allow for admin creation
  document.querySelector("#create-admin").addEventListener("submit", async (evt) => {
    evt.preventDefault();
    var form = evt.target;
    var name = form.name.value;
    var username = form.username.value;
    var password = form.password.value;

    var stats = await fetch(`${apiOrigin}/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        name, username, password
      }),
    }).then(res => res.json());

    var button = form.querySelector("input[type='submit']");

    if(stats.failed){
      console.error("[error] failed to create admin");
      console.error(stats.message);
      button.value = "Failed: Try Again?";
      return;
    }

    button.innerText = "Created Admin ✅";
    button.value = true;
  });

  /**
   * LAX-YYC | LAX    | YYC         | Passport    |
   * | YEG-YYC | YEG    | YYC         | NULL        |
   * | YYC-LAX | YYC    | LAX         | Passport    |
   * | YYC-YEG | YYC    | YEG         | NULL        |
   * | YYC-YYZ | YYC    | YYZ         | NULL        |
   * | YYZ-YYC
   */

  // get all route names
  var routeData = await fetch(`${apiOrigin}/routes`).then(res => res.json());

  if(routeData.failed){
    console.error("[error] failed to retrieve route data");
    console.error(routeData.message);
  }else{
    for(var route of routeData.data){
      var routeOption = document.createElement("option");
      routeOption.value = route.name;
      routeOption.innerText = route.name;
      document.querySelector("#add-flight select[name='route']").appendChild(routeOption);
    }
  }

  // allow for flight creation
  document.querySelector("#add-flight").addEventListener("submit",  async (evt) => {
    evt.preventDefault();
    var form = evt.target;

    var airline = form.airline.value;
    var flightNumber = form["flight-num"].value;
    var route = form.route.value;
    var aircraft = form.aircraft.value;
    var departure_date = form.departure_date.value;
    var departure_time = form.departure_time.value;
    var arrival_date = form.arrival_date.value;
    var arrival_time = form.arrival_time.value;

    var stats = await fetch(`${apiOrigin}/flights`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        airline,
        flightNumber,
        route,
        aircraft,
        departure_date,
        departure_time,
        arrival_date,
        arrival_time,
      }),
    }).then(res => res.json());

    var button = form.querySelector("input[type='submit']");
    if(stats.failed){
      console.error("[error] failed to add flight");
      console.error(stats.message);
      button.innerText = "Failed: Try Again?";
      return;
    }

    button.value = "Created Flight ✅";
    button.disabled = true;
  });
}

window.addEventListener("load", () => {admin()});
