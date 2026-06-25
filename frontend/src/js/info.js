import { gsapAnimReveal, syncUserProfile } from "./utils.js";

export function initInfoPage() {
  gsapAnimReveal();
  syncUserProfile();

  // Logout button
  const logoutBtn = document.querySelector(".btn-logout");
  logoutBtn.addEventListener("click", () => {
    if (confirm("Apakah Anda yakin ingin logout?")) {
      // Redirect to login page
      window.location.href = "login.html";
    }
  });
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initInfoPage);
