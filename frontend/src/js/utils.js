import gsap from "gsap";
import { checkAuth } from "./http/user.js";

export function showLoader() {
  let loader = document.getElementById("global-loader");
  if (!loader) {
    loader = document.createElement("div");
    loader.id = "global-loader";
    loader.className = "loader-overlay";
    loader.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loader);
  }

  loader.classList.add("active");
}

export function hideLoader() {
  const loader = document.getElementById("global-loader");
  if (loader) {
    loader.classList.remove("active");
  }
}

export function gsapAnimReveal() {
  const revealElements = document.querySelectorAll(".gsap-reveal");
  if (!revealElements.length) return;

  if (typeof gsap?.fromTo !== "function") {
    revealElements.forEach((el) => {
      el.style.opacity = "1";
      el.style.visibility = "visible";
      el.style.transform = "none";
    });
    return;
  }

  gsap.fromTo(
    revealElements,
    { y: 30, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
  );
}

export async function syncUserProfile() {
  const userNameEl = document.getElementById("sidebar-user-name");
  const userRoleEl = document.getElementById("sidebar-user-role");
  const adminBadge = document.getElementById("admin-badge");

  const authResult = await checkAuth();
  const currentUser = authResult?.data ?? null;

  if (userNameEl && currentUser?.username) {
    userNameEl.textContent = currentUser.username;
  }

  if (userRoleEl) {
    userRoleEl.textContent = currentUser?.role === "ADMIN" ? "Admin" : "User";
  }

  if (adminBadge) {
    if (currentUser?.role === "ADMIN") {
      adminBadge.classList.remove("d-none");
    } else {
      adminBadge.classList.add("d-none");
    }
  }

  return currentUser;
}
