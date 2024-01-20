console.log("JavaScript file loaded successfully!");
const registerForm = document.querySelector("#registrationForm");

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  const data = {
    email: email,
    password: password,
  };

  // POST JSON to backend route for user registration
  fetch("/api/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      // Handle the response
      console.log(result);
      // Redirect to "/login.html"
      window.location.href = "/login.html";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
