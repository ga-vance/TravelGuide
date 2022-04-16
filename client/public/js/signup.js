/**
 * signup.js
 */

function f(){
  const apiOrigin = `http://${window.location.hostname}:3000`

  document.querySelector("#signupForm")
  .addEventListener("submit", async (evt) => {
    evt.preventDefault();
    var name = evt.target["name"].value;
    var username = evt.target["username"].value;
    var password = evt.target["password"].value;
    var checkPassword = evt.target["password2"].value;
    var creditcardnumber = evt.target["creditCard"].value;
    var creditcardExpiry = evt.target["expiryDate"].value;

    if(password !== checkPassword){
      console.error("[error] password mismatch!");
      alert("Passwords do not match");
      return;
    }

    var res = await fetch(`${apiOrigin}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        username,
        password,
        creditcardnumber,
        creditcardExpiry,
      }),
    }).then((response) => response.json());

    if(res.failed){
      console.error("[error] signup failed");
      console.error(res.message);
      return;
    }

    console.log("[info] signed up successfully!");
    window.location.href = "/login.html";
  });
}

window.addEventListener("load", () => {f()});
