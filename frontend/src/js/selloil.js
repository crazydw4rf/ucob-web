import {
  gsapAnimReveal,
  syncUserProfile,
  setupLogout,
  requireAuth,
  showLoader,
  hideLoader,
} from "./utils.js";
import { buildAddressPayload, createTransaction } from "./http/transaction.js";

const PRICE_PER_LITER = 6000;

export function initSellOilPage() {
  document.addEventListener("DOMContentLoaded", async () => {
    const currentUser = await requireAuth();
    if (!currentUser) return;

    gsapAnimReveal();
    await syncUserProfile();
    setupLogout();

    const oilVolumeInput = document.getElementById("oil-volume");
    const totalPriceDisplay = document.getElementById("total-price");
    const priceCalculationDisplay = document.getElementById("price-calculation");

    oilVolumeInput.addEventListener("input", () => {
      const volume = parseFloat(oilVolumeInput.value) || 0;
      const totalPrice = volume * PRICE_PER_LITER;

      totalPriceDisplay.textContent = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(totalPrice);

      priceCalculationDisplay.textContent = `Total = ${volume} Liter x Rp ${PRICE_PER_LITER.toLocaleString("id-ID")}`;
    });

    const sellForm = document.getElementById("sell-form");
    const successModalElement = document.getElementById("successModal");
    const successModal = new bootstrap.Modal(successModalElement, {
      backdrop: "static",
      keyboard: false,
    });

    sellForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const volume = parseFloat(document.getElementById("oil-volume").value);
      const address = document.getElementById("seller-address").value;

      if (!volume || volume <= 0) {
        alert("Silakan masukkan volume minyak yang valid");
        return;
      }

      if (!address.trim()) {
        alert("Silakan masukkan alamat penjemputan");
        return;
      }

      const submitBtn = sellForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      showLoader();

      const result = await createTransaction({
        oil_volume: volume,
        transaction_type: "Sale",
        ...buildAddressPayload(address),
        sale_image_url: null,
      });

      hideLoader();
      submitBtn.disabled = false;

      if (!result.success) {
        alert(result.error?.message || "Gagal mengirim permintaan penjualan.");
        return;
      }

      successModal.show();
      sellForm.reset();
      totalPriceDisplay.textContent = "Rp 0";
      priceCalculationDisplay.textContent = "Total = 0 Liter x Rp 6.000";
    });

    document.getElementById("btn-kembali").addEventListener("click", () => {
      successModal.hide();
    });
  });
}

initSellOilPage();
