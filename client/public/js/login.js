/**
 * login.js
 */
function f(){
  const apiOrigin = `http://${window.location.hostname}:3000`

  function checkToken(resJson){
    if(resJson.failed){
      console.error("[error] Something went wrong...");
      console.error(resJson.message);
      return;
    }

    localStorage.setItem("sesstoken", resJson.data.token);
    console.log("successfully logged in");
  }
  document.querySelector("#login-form").addEventListener("submit", (evt) => {
    evt.preventDefault();
    var user = evt.target["username"].value
    var pass = evt.target["password"].value
    // send form data to the api
    fetch(`${apiOrigin}/users/genToken`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user,
        pass,
      }),
    }).then((res) => res.json()).then(checkToken);
  });
}

window.addEventListener("load", () => {f()});
