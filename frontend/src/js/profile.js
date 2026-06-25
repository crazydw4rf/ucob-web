import { showLoader, hideLoader } from "./utils.js";
import { ambilDataUser } from "./http/user.js";

document.addEventListener("DOMContentLoaded", async () => {
  showLoader();

  const user = await ambilDataUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const username = user.username || user.first_name || "User";
  const roleText = user.role === "ADMIN" ? "Admin" : "User";

  document.getElementById("profile-name").textContent = username;
  document.getElementById("profile-username").textContent = username;
  document.getElementById("profile-email").textContent = user.email;

  const roleBadge = document.getElementById("profile-role");
  roleBadge.textContent = roleText;
  roleBadge.classList.remove("bg-primary", "bg-danger");
  roleBadge.classList.add(user.role === "ADMIN" ? "bg-danger" : "bg-primary");

  const navbarUserName = document.getElementById("navbar-user-name");
  if (navbarUserName) {
    navbarUserName.textContent = username;
    navbarUserName.className = `ms-2 badge ${user.role === "ADMIN" ? "bg-danger-subtle text-danger" : "bg-success-subtle text-success"}`;
  }

  hideLoader();
});
