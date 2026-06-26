import {
  gsapAnimReveal,
  syncUserProfile,
  setupLogout,
  requireAdmin,
  getDisplayName,
} from "./utils.js";

export async function initAdminPage() {
  const currentUser = await requireAdmin();
  if (!currentUser) return null;

  await syncUserProfile();
  setupLogout();
  gsapAnimReveal();

  const welcomeTitle = document.getElementById("admin-welcome-title");
  if (welcomeTitle) {
    welcomeTitle.textContent = `Halo, ${getDisplayName(currentUser)}`;
  }

  return currentUser;
}
