import { showLoader, hideLoader } from "./utils.js";
import { ambilDataUser } from "./http/user.ts";

document.addEventListener("DOMContentLoaded", async () => {
  showLoader();

  const user = await ambilDataUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const fullName = `${user.first_name} ${user.last_name || ""}`.trim();
  document.getElementById("profile-name").textContent = fullName;
  document.getElementById("profile-first-name").textContent = user.first_name;
  document.getElementById("profile-last-name").textContent = user.last_name || "-";
  document.getElementById("profile-email").textContent = user.email;

  const roleBadge = document.getElementById("profile-role");
  roleBadge.textContent = user.role;
  if (user.role === "ADMIN") {
    roleBadge.classList.replace("bg-primary", "bg-danger");
  }

  hideLoader();
});
