import { gsapAnimReveal, syncUserProfile, setupLogout, requireAuth } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  const currentUser = await requireAuth();
  if (!currentUser) return;

  gsapAnimReveal();
  await syncUserProfile();
  setupLogout();
});
