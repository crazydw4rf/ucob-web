import { gsapAnimReveal, syncUserProfile } from "./utils.js";

export function initSellOilPage() {
  gsapAnimReveal();
  syncUserProfile();

  // Price calculation
  const pricePerLiter = 6000;
  const oilVolumeInput = document.getElementById("oil-volume");
  const totalPriceDisplay = document.getElementById("total-price");
  const priceCalculationDisplay = document.getElementById("price-calculation");

  oilVolumeInput.addEventListener("input", () => {
    const volume = parseFloat(oilVolumeInput.value) || 0;
    const totalPrice = volume * pricePerLiter;

    // Format currency
    const formattedPrice = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(totalPrice);

    totalPriceDisplay.textContent = formattedPrice;
    priceCalculationDisplay.textContent = `Total = ${volume} Liter x Rp ${pricePerLiter.toLocaleString("id-ID")}`;
  });

  // Form submission
  const sellForm = document.getElementById("sell-form");
  const successModalElement = document.getElementById("successModal");
  const successModal = new bootstrap.Modal(successModalElement, {
    backdrop: "static",
    keyboard: false,
  });

  sellForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const volume = document.getElementById("oil-volume").value;
    const address = document.getElementById("seller-address").value;

    if (!volume || volume <= 0) {
      alert("Silakan masukkan volume minyak yang valid");
      return;
    }

    if (!address.trim()) {
      alert("Silakan masukkan alamat penjemputan");
      return;
    }

    // Show success modal
    successModal.show();

    // Reset form
    sellForm.reset();
    totalPriceDisplay.textContent = "Rp 0";
    priceCalculationDisplay.textContent = "Total = 0 Liter x Rp 6.000";
  });

  // Kembali button handler
  const btnKembali = document.getElementById("btn-kembali");
  btnKembali.addEventListener("click", () => {
    successModal.hide();
    // Stay on the same page (selloil.html)
    // Optionally, you can redirect to dashboard
    // window.location.href = "selloil.html";
  });

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
document.addEventListener("DOMContentLoaded", initSellOilPage);
