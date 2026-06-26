import {
  gsapAnimReveal,
  syncUserProfile,
  setupLogout,
  requireAuth,
  formatQuantityLiter,
  formatCurrencyIdr,
  getStatusBadge,
} from "./utils.js";
import { formatTransactionAddress, getTransactions } from "./http/transaction.js";

const SELL_PRICE = 6000;
const BUY_PRICE = 5500;

async function loadTransactionHistory() {
  const transactions = await getTransactions();

  const sellData = transactions.filter((tx) => tx.transaction_type === "Sale");
  const buyData = transactions.filter((tx) => tx.transaction_type === "Purchase");

  renderTable(sellData, "sell-history-table", SELL_PRICE);
  renderTable(buyData, "buy-history-table", BUY_PRICE);
}

function renderTable(data, tbodyId, pricePerLiter) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">Tidak ada data</td></tr>`;
    return;
  }

  tbody.innerHTML = data
    .map((item) => {
      const total = item.oil_volume * pricePerLiter;
      const address = formatTransactionAddress(item);

      return `
        <tr>
          <td class="ps-4">${new Date(item.created_at).toLocaleDateString("id-ID")}</td>
          <td class="fw-bold">${formatQuantityLiter(item.oil_volume)}</td>
          <td class="text-truncate" style="max-width: 220px;" title="${address}">${address}</td>
          <td class="fw-bold">${formatCurrencyIdr(total)}</td>
          <td>${getStatusBadge(item.status)}</td>
        </tr>
      `;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  const currentUser = await requireAuth();
  if (!currentUser) return;

  gsapAnimReveal();
  await syncUserProfile();
  setupLogout();
  await loadTransactionHistory();
});
