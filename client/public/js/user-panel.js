/**
 * user-panel.js
 */

async function f(){
  const apiOrigin = `http://${window.location.hostname}:3000`
  // fetch current user information and populate page with that data
  // get userID from token
  var token = localStorage.getItem("sesstoken");
  var userId = JSON.parse(atob(token.slice('.')[1])).userId;
  var user_info = await fetch(`${apiOrigin}/users/${userId}`, {
    method: "GET",
    withCredentials: true,
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  }).then((res) => {return res.json();});
}

window.addEventListener("load", () => {f()})
