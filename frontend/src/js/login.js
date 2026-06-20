import { ApiRequest } from "./api";

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.querySelector("#email").value.trim();
  const password = document.getElementById("password").value;
  const alertContainer = document.getElementById("alert-container");
  const submitBtn = e.target.querySelector('button[type="submit"]');

  if (!alertContainer || !submitBtn) {
    return;
  }

  alertContainer.innerHTML = "";

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';

    const response = await ApiRequest("/auth/login").postRequest({
      email,
      password,
    });
    const data = JSON.parse(response.data);
    console.log("Login response:");

    if (data?.success) {
      alertContainer.innerHTML = '<div class="alert alert-success">Login successful! Redirecting...</div>';

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      alertContainer.innerHTML = `<div class="alert alert-danger">${data?.error?.message || "Login failed. Please check your credentials."}</div>`;
    }
  } catch (error) {
    console.error("Login error:", error);
    alertContainer.innerHTML =
      '<div class="alert alert-danger">An unexpected error occurred. Check if the server is running.</div>';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Log In";
  }
});
