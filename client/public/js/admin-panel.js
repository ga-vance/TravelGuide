/**
 * admin-panel.js
 */

function admin(){
  const apiOrigin = `http://${window.location.hostname}:3000`;

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
}

window.addEventListener("load", () => {admin()});
