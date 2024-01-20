console.log("JavaScript file loaded successfully!");

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    var email = document.getElementById("emailinput").value;
    var password = document.getElementById("passwordinput").value;

    // POST Request to login user
    fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Login failed");
        }
      })
      .then(function (data) {
        // Save token to local storage
        localStorage.setItem("auth_token", data.token);

        // Redirect to "/" page
        window.location.href = "/";
      })
      .catch(function (error) {
        console.error(error);
      });
  });
