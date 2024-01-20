//if user logged in
const authToken = localStorage.getItem("auth_token");
if (!authToken) {
  // User is not logged in, links to register and login
  const container = document.getElementById("container");
  container.innerHTML = `
    <a href="/register.html">Register</a>
    <a href="/login.html">Login</a>
  `;
} else {
  // User logged in, display email, logout, and add item input
  const userEmail = JSON.parse(atob(authToken.split(".")[1])).email;
  const container = document.getElementById("container");
  container.innerHTML = `
    <p>Welcome, ${userEmail}!</p>
    <button id="logout">Logout</button>
    <input type="text" id="add-item" placeholder="Add item">
  `;

  // logout
  const logoutButton = document.getElementById("logout");
  logoutButton.addEventListener("click", () => {
    // clear token from local storage
    localStorage.removeItem("auth_token");
    //window.location.href = "/login.html";
    window.location.reload();
  });

  // add todos
  const addItemInput = document.getElementById("add-item");
  addItemInput.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      const newItem = addItemInput.value;
      // Save the new item to the database and link it to the user
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ items: newItem }),
      });
      if (response.ok) {
        // Refresh the page to show the updated items
        window.location.reload();
      } else {
        console.error("Failed to save item to database");
      }
    }
  });
}
//
