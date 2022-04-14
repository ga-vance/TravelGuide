/**
 * admin-panel.js
 */

function admin(){
  const apiOrigin = `http://${window.location.hostname}:3000`;

  // specify the element to log out
  document.querySelector("#logout").addEventListener("click", () => {
    localStorage.removeItem("sesstoken");
    window.location.href = "/";
  });
}

window.addEventListener("load", () => {admin()});
