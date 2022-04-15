/**
 * user-panel.js
 */

async function user(){
  const apiOrigin = `http://${window.location.hostname}:3000`

  // specify the element to log out
  document.querySelector("#logout").addEventListener("click", () => {
    localStorage.removeItem("sesstoken");
    window.location.href = "/";
  });

  // fetch current user information and populate page with that data
  // get userID from token
  var token = localStorage.getItem("sesstoken");
  var tokenData
  try{
    tokenData = JSON.parse(atob(token.split('.')[1]));
  }catch(err){
    // token is malformed, go to login page
    console.error("[error] missing or malformed token");
    window.location.replace("/login.html");
    return;
  }
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

  if(tokenData.isAdmin){
    // account is actually administrative, go to admin panel
    window.location.replace("/admin-panel.html");
    return;
  }

  console.log(userInfo);
  document.querySelector("#user-info > h1").innerText = userInfo.name;
  var updateAccount = document.querySelector("#update-account");
  updateAccount.name.value = userInfo.name;
  updateAccount.username.value = userInfo.username;
  updateAccount["credit-number"].value = `************${userInfo.creditcardnumber.substr(-4)}`;
  updateAccount["credit-expire"].value = userInfo.creditcardExpiry;
}

window.addEventListener("load", () => {user()})
