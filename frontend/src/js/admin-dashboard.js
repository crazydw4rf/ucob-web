import { initAdminPage } from "./admin-shared.js";
import {
  formatQuantityLiter,
  getStatusBadge,
  getTransactionTypeBadge,
  formatDateId,
} from "./utils.js";
import { getAdminTransactions } from "./http/transaction.js";

function computeStats(transactions) {
  return {
    total: transactions.length,
    pending: transactions.filter((tx) => String(tx.status).toLowerCase() === "pending").length,
    sale: transactions.filter((tx) => tx.transaction_type === "Sale").length,
    purchase: transactions.filter((tx) => tx.transaction_type === "Purchase").length,
  };
}

function renderStats(stats) {
  document.getElementById("stat-total").textContent = stats.total;
  document.getElementById("stat-pending").textContent = stats.pending;
  document.getElementById("stat-sale").textContent = stats.sale;
  document.getElementById("stat-purchase").textContent = stats.purchase;
}

function renderRecentTable(transactions) {
  const tbody = document.getElementById("recent-transactions-body");
  const recent = transactions.slice(0, 8);

  if (!recent.length) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="text-center py-4 text-muted">Belum ada transaksi.</td></tr>';
    return;
  }

  tbody.innerHTML = recent
    .map(
      (tx) => `
      <tr>
        <td class="ps-4 fw-semibold">#${tx.id}</td>
        <td>${formatDateId(tx.created_at)}</td>
        <td>${getTransactionTypeBadge(tx.transaction_type)}</td>
        <td class="fw-bold">${formatQuantityLiter(tx.oil_volume)}</td>
        <td>${getStatusBadge(tx.status)}</td>
        <td class="text-end pe-4">
          <a href="admin-transactions.html?id=${tx.id}" class="btn btn-sm btn-outline-primary">Detail</a>
        </td>
      </tr>
    `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  await initAdminPage();

  const { items } = await getAdminTransactions(1, 100);
  const stats = computeStats(items);

  renderStats(stats);
  renderRecentTable(items);
});
