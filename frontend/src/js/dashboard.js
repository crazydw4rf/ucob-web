import {
  showLoader,
  hideLoader,
  gsapAnimReveal,
  syncUserProfile,
  setupLogout,
  requireAuth,
  getDisplayName,
  isAdminRole,
} from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  const currentUser = await requireAuth();
  if (!currentUser) return;

  if (isAdminRole(currentUser.role)) {
    window.location.href = "admin-dashboard.html";
    return;
  }

  gsapAnimReveal();
  await syncUserProfile();
  setupLogout();

  const welcomeTitle = document.getElementById("welcome-title");
  const welcomeSubtitle = document.getElementById("welcome-subtitle");

  if (welcomeTitle) {
    welcomeTitle.textContent = `Welcome, ${getDisplayName(currentUser)}!`;
  }

  if (welcomeSubtitle) {
    welcomeSubtitle.textContent = isAdminRole(currentUser.role)
      ? "Panel admin UCOB. Kelola transaksi dan pantau aktivitas platform."
      : "Selamat datang di UCOB. Pilih layanan untuk langsung mulai jual atau beli minyak jelantah.";
  }

  hideLoader();
});
