import { showLoader, hideLoader, getDisplayName, getRoleLabel, isAdminRole, setupLogout } from "./utils.js";
import { ambilDataUser } from "./http/user.js";

document.addEventListener("DOMContentLoaded", async () => {
  showLoader();

  const result = await ambilDataUser();

  if (!result?.data) {
    window.location.href = "login.html";
    return;
  }

  const user = result.data;
  const username = getDisplayName(user);
  const roleText = getRoleLabel(user.role);

  document.getElementById("profile-name").textContent = username;
  document.getElementById("profile-username").textContent = username;
  document.getElementById("profile-email").textContent = user.email || "-";

  const roleBadge = document.getElementById("profile-role");
  roleBadge.textContent = roleText;
  roleBadge.classList.remove("bg-primary", "bg-danger");
  roleBadge.classList.add(isAdminRole(user.role) ? "bg-danger" : "bg-primary");

  const navbarUserName = document.getElementById("navbar-user-name");
  if (navbarUserName) {
    navbarUserName.textContent = username;
    navbarUserName.className = `ms-2 badge ${isAdminRole(user.role) ? "bg-danger-subtle text-danger" : "bg-success-subtle text-success"}`;
  }

  if (user.created_at) {
    const createdEl = document.getElementById("profile-created");
    if (createdEl) {
      createdEl.textContent = new Date(user.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  }

  const adminPanelLink = document.getElementById("admin-panel-link");
  if (adminPanelLink && isAdminRole(user.role)) {
    adminPanelLink.classList.remove("d-none");
  }

  setupLogout();
  hideLoader();
});
