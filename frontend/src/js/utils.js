import gsap from "gsap";
import { logoutUser } from "./http/auth.js";
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

export function isAdminRole(role) {
  return role === "Admin" || role === "ADMIN";
}

export function getDisplayName(user) {
  if (!user) return "User";
  if (user.username) return user.username;
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
  return fullName || "User";
}

export function getRoleLabel(role) {
  return isAdminRole(role) ? "Admin" : "User";
}

export function formatQuantityLiter(volume) {
  const value = Number.parseFloat(volume);
  if (Number.isNaN(value)) return "0 L";
  const formatted = value.toFixed(1).replace(".", ",");
  return `${formatted} L`;
}

export function formatCurrencyIdr(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getStatusBadge(status) {
  const s = String(status).toUpperCase();
  if (s === "PENDING") return '<span class="badge badge-pending rounded-pill px-3 py-1">Pending</span>';
  if (s === "ACCEPTED") return '<span class="badge badge-accepted rounded-pill px-3 py-1">Accepted</span>';
  if (s === "VERIFIED") return '<span class="badge badge-accepted rounded-pill px-3 py-1">Verified</span>';
  if (s === "REJECTED") return '<span class="badge badge-rejected rounded-pill px-3 py-1">Rejected</span>';
  return `<span class="badge bg-secondary rounded-pill px-3 py-1">${status}</span>`;
}

export async function syncUserProfile() {
  const userNameEl = document.getElementById("sidebar-user-name");
  const userRoleEl = document.getElementById("sidebar-user-role");
  const adminBadge = document.getElementById("admin-badge");
  const topNavbar = document.getElementById("top-navbar");

  const authResult = await checkAuth();
  const currentUser = authResult?.data ?? null;

  if (!currentUser) {
    return null;
  }

  const displayName = getDisplayName(currentUser);
  const roleLabel = getRoleLabel(currentUser.role);
  const isAdmin = isAdminRole(currentUser.role);

  if (userNameEl) {
    userNameEl.textContent = displayName;
  }

  if (userRoleEl) {
    userRoleEl.textContent = roleLabel;
  }

  if (adminBadge) {
    adminBadge.classList.toggle("d-none", !isAdmin);
  }

  if (topNavbar && isAdmin) {
    topNavbar.classList.replace("bg-white", "bg-dark");
    topNavbar.classList.add("navbar-dark");
  }

  return currentUser;
}

export function setupLogout() {
  document.querySelectorAll(".btn-logout").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Apakah Anda yakin ingin logout?")) return;

      showLoader();
      await logoutUser();
      hideLoader();
      window.location.href = "login.html";
    });
  });
}

export async function requireAuth() {
  showLoader();
  const authResult = await checkAuth();
  const currentUser = authResult?.data ?? null;

  if (!currentUser) {
    window.location.href = "login.html";
    return null;
  }

  hideLoader();
  return currentUser;
}

export async function requireAdmin() {
  showLoader();
  const authResult = await checkAuth();
  const currentUser = authResult?.data ?? null;

  if (!currentUser) {
    window.location.href = "login.html";
    return null;
  }

  if (!isAdminRole(currentUser.role)) {
    window.location.href = "dashboard.html";
    return null;
  }

  hideLoader();
  return currentUser;
}

export function getTransactionTypeLabel(type) {
  return type === "Sale" ? "Penjualan" : type === "Purchase" ? "Pembelian" : type;
}

export function getTransactionTypeBadge(type) {
  if (type === "Sale") {
    return '<span class="badge bg-success-subtle text-success">Penjualan</span>';
  }
  if (type === "Purchase") {
    return '<span class="badge bg-primary-subtle text-primary">Pembelian</span>';
  }
  return `<span class="badge bg-secondary">${type}</span>`;
}

export function formatDateId(dateString) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
