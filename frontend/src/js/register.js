import { registerUser } from "./http/user.js";

const form = document.getElementById("register-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const alertContainer = document.getElementById("alert-container");
  const submitBtn = e.target.querySelector('button[type="submit"]');

  if (!alertContainer || !submitBtn) {
    return;
  }

  alertContainer.innerHTML = "";

  if (!username || !email || !password) {
    alertContainer.innerHTML = '<div class="alert alert-danger">Please fill in all required fields.</div>';
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alertContainer.innerHTML = '<div class="alert alert-danger">Please enter a valid email address.</div>';
    return;
  }

  if (password.length < 6) {
    alertContainer.innerHTML = '<div class="alert alert-danger">Password must be at least 6 characters long.</div>';
    return;
  }

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registering...';

    const data = await registerUser({
      username,
      email,
      password,
    });

    const isSuccess = data?.success === true || data?.code === 201 || data?.code === 200;

    if (isSuccess) {
      alertContainer.innerHTML =
        '<div class="alert alert-success">Registration successful! Redirecting to login...</div>';
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    } else {
      const errorMessage = data?.error?.message || data?.message || "Registration failed. Please try again.";
      alertContainer.innerHTML = `<div class="alert alert-danger">${errorMessage}</div>`;
    }
  } catch (error) {
    console.error("Registration error:", error);
    alertContainer.innerHTML =
      '<div class="alert alert-danger">An unexpected error occurred. Check if the server is running.</div>';
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = "Register";
  }
});
