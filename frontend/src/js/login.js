import { loginUser } from "./http/auth.js";
import { checkAuth } from "./http/user.js";
import { isAdminRole } from "./utils.js";

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

    const data = await loginUser({ email, password });

    if (data?.success) {
      alertContainer.innerHTML = '<div class="alert alert-success">Login successful! Redirecting...</div>';

      const authResult = await checkAuth();
      const role = authResult?.data?.role;
      const destination = isAdminRole(role) ? "admin-dashboard.html" : "dashboard.html";

      setTimeout(() => {
        window.location.href = destination;
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
    submitBtn.innerHTML = "Log In";
  }
});
