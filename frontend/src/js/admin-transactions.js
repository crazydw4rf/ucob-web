import { initAdminPage } from "./admin-shared.js";
import {
  formatQuantityLiter,
  getStatusBadge,
  getTransactionTypeBadge,
  formatDateId,
  showLoader,
  hideLoader,
} from "./utils.js";
import {
  formatTransactionAddress,
  getAdminTransactions,
  getTransactionById,
} from "./http/transaction.js";

const SELL_PRICE = 6000;
const BUY_PRICE = 5500;

let currentPage = 1;
const pageSize = 10;
let allItems = [];
let filteredItems = [];

function getTotalPrice(tx) {
  const price = tx.transaction_type === "Sale" ? SELL_PRICE : BUY_PRICE;
  return tx.oil_volume * price;
}

function applyFilters() {
  const statusFilter = document.getElementById("filter-status").value;
  const typeFilter = document.getElementById("filter-type").value;

  filteredItems = allItems.filter((tx) => {
    const statusMatch =
      statusFilter === "all" || String(tx.status).toLowerCase() === statusFilter.toLowerCase();
    const typeMatch = typeFilter === "all" || tx.transaction_type === typeFilter;
    return statusMatch && typeMatch;
  });

  currentPage = 1;
  renderTable();
  renderPagination();
}

function renderTable() {
  const tbody = document.getElementById("admin-transactions-body");
  const start = (currentPage - 1) * pageSize;
  const pageItems = filteredItems.slice(start, start + pageSize);

  if (!pageItems.length) {
    tbody.innerHTML =
      '<tr><td colspan="8" class="text-center py-4 text-muted">Tidak ada transaksi ditemukan.</td></tr>';
    return;
  }

  tbody.innerHTML = pageItems
    .map((tx) => {
      const address = formatTransactionAddress(tx);
      return `
        <tr>
          <td class="ps-4 fw-semibold">#${tx.id}</td>
          <td>${formatDateId(tx.created_at)}</td>
          <td><span class="text-muted">#${tx.user_id}</span></td>
          <td>${getTransactionTypeBadge(tx.transaction_type)}</td>
          <td class="fw-bold">${formatQuantityLiter(tx.oil_volume)}</td>
          <td class="text-truncate" style="max-width: 180px;" title="${address}">${address}</td>
          <td>${getStatusBadge(tx.status)}</td>
          <td class="text-end pe-4">
            <button class="btn btn-sm btn-outline-primary btn-view-detail" data-id="${tx.id}">
              Detail
            </button>
          </td>
        </tr>
      `;
    })
    .join("");

  tbody.querySelectorAll(".btn-view-detail").forEach((btn) => {
    btn.addEventListener("click", () => showDetailModal(Number(btn.dataset.id)));
  });
}

function renderPagination() {
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const paginationEl = document.getElementById("pagination-info");
  const prevBtn = document.getElementById("btn-prev-page");
  const nextBtn = document.getElementById("btn-next-page");

  paginationEl.textContent = `Halaman ${currentPage} dari ${totalPages} (${filteredItems.length} transaksi)`;
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;
}

async function showDetailModal(id) {
  showLoader();
  const tx = await getTransactionById(id);
  hideLoader();

  if (!tx) {
    alert("Gagal memuat detail transaksi.");
    return;
  }

  const address = formatTransactionAddress(tx);
  const total = getTotalPrice(tx);
  const detailModal = new bootstrap.Modal(document.getElementById("detailModal"));

  document.getElementById("detail-id").textContent = `#${tx.id}`;
  document.getElementById("detail-date").textContent = formatDateId(tx.created_at);
  document.getElementById("detail-user").textContent = `#${tx.user_id}`;
  document.getElementById("detail-type").innerHTML = getTransactionTypeBadge(tx.transaction_type);
  document.getElementById("detail-volume").textContent = formatQuantityLiter(tx.oil_volume);
  document.getElementById("detail-address").textContent = address;
  document.getElementById("detail-total").textContent = formatCurrencyIdr(total);
  document.getElementById("detail-status").innerHTML = getStatusBadge(tx.status);
  document.getElementById("detail-payment").textContent = tx.payment_id ? `#${tx.payment_id}` : "-";

  detailModal.show();
}

async function loadTransactions() {
  showLoader();
  const { items } = await getAdminTransactions(1, 200);
  hideLoader();

  allItems = items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  filteredItems = [...allItems];
  renderTable();
  renderPagination();
}

document.addEventListener("DOMContentLoaded", async () => {
  await initAdminPage();

  document.getElementById("filter-status").addEventListener("change", applyFilters);
  document.getElementById("filter-type").addEventListener("change", applyFilters);

  document.getElementById("btn-prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage -= 1;
      renderTable();
      renderPagination();
    }
  });

  document.getElementById("btn-next-page").addEventListener("click", () => {
    const totalPages = Math.ceil(filteredItems.length / pageSize);
    if (currentPage < totalPages) {
      currentPage += 1;
      renderTable();
      renderPagination();
    }
  });

  await loadTransactions();

  const params = new URLSearchParams(window.location.search);
  const detailId = params.get("id");
  if (detailId) {
    await showDetailModal(Number(detailId));
    window.history.replaceState({}, "", "admin-transactions.html");
  }
});
