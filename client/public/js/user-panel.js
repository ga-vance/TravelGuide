/**
 * user-panel.js
 */

async function f(){
  const apiOrigin = `http://${window.location.hostname}:3000`
  // fetch current user information and populate page with that data
  // get userID from token
  var token = localStorage.getItem("sesstoken");
  var tokenData
  try{
    tokenData = JSON.parse(atob(token.split('.')[1]));
  }catch(err){
    // token is malformed, go to login page
    console.error("[error] malformed token");
    window.location.href = "/login.html";
  }
  var userId = tokenData.userId;
  var userInfo = await fetch(`${apiOrigin}/users/${userId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  }).then((res) => {return res.json();});

  if(userInfo.failed){
    console.error("[error] cannot access user panel");
    console.error(userInfo.message);
    window.location.href = "/login.html";
    return;
  }

  if(tokenData.isAdmin){
    // account is actually administrative, go to admin panel
    window.location.replace("/admin-panel.html");
    return;
  }
}

window.addEventListener("load", () => {f()})
