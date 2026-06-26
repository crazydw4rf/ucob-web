import {
  gsapAnimReveal,
  syncUserProfile,
  setupLogout,
  requireAuth,
  showLoader,
  hideLoader,
} from "./utils.js";
import { buildAddressPayload, createTransaction } from "./http/transaction.js";

const PRICE_PER_LITER = 5500;

export function initBuyOilPage() {
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

    const buyForm = document.getElementById("buy-form");
    const successModalElement = document.getElementById("successModal");
    const successModal = new bootstrap.Modal(successModalElement, {
      backdrop: "static",
      keyboard: false,
    });

    buyForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const volume = parseFloat(document.getElementById("oil-volume").value);
      const address = document.getElementById("delivery-address").value;

      if (!volume || volume <= 0) {
        alert("Silakan masukkan volume minyak yang valid");
        return;
      }

      if (!address.trim()) {
        alert("Silakan masukkan alamat pengiriman");
        return;
      }

      const submitBtn = buyForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      showLoader();

      const result = await createTransaction({
        oil_volume: volume,
        transaction_type: "Purchase",
        ...buildAddressPayload(address),
        sale_image_url: null,
      });

      hideLoader();
      submitBtn.disabled = false;

      if (!result.success) {
        alert(result.error?.message || "Gagal mengirim permintaan pembelian.");
        return;
      }

      successModal.show();
      buyForm.reset();
      totalPriceDisplay.textContent = "Rp 0";
      priceCalculationDisplay.textContent = "Total = 0 Liter x Rp 5.500";
    });

    document.getElementById("btn-kembali").addEventListener("click", () => {
      successModal.hide();
    });
  });
}

initBuyOilPage();
