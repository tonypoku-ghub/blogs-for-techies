const toggleLoginSignupHandler = () => {
  const toggleLink = document.querySelector("#toggleLoginSignup");

  const isLogIn = toggleLink.getAttribute("data-type") === "login";

  if (isLogIn) {
    toggleLink.textContent = "Login instead";
    toggleLink.setAttribute("data-type", "signup");
    document.querySelector("#LoginSignUpBtn").innerHTML = "Sign up";
  } else {
    toggleLink.textContent = "Signup instead";
    toggleLink.setAttribute("data-type", "login");
    document.querySelector("#LoginSignUpBtn").innerHTML = "Login";
  }
};

const loginFormHandler = async (event) => {
  event.preventDefault();

  // Collect values from the login form
  const username = document.querySelector("#username").value.trim();
  const password = document.querySelector("#password").value.trim();
  const toggleLink = document.querySelector("#toggleLoginSignup");
  const isLogIn = toggleLink.getAttribute("data-type") === "login";

  if (username && password) {
    // Send a POST request to the API endpoint
    const response = await fetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify({ username, password, isLogIn }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      // If successful, redirect the browser to the profile page
      document.location.replace("/");
    } else {
      const data = await response.json();
      alert(data.message);
    }
  }
};

document
  .querySelector("#toggleLoginSignup")
  .addEventListener("click", toggleLoginSignupHandler);

document
  .querySelector("#LoginSignUpBtn")
  .addEventListener("click", loginFormHandler);
