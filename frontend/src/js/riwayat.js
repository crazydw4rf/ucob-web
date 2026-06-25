import { gsapAnimReveal, syncUserProfile } from "./utils.js";

export function initRiwayatPage() {
  gsapAnimReveal();
  syncUserProfile();

  // Logout button
  const logoutBtn = document.querySelector(".btn-logout");
  logoutBtn.addEventListener("click", () => {
    if (confirm("Apakah Anda yakin ingin logout?")) {
      // Redirect to login page
      window.location.href = "login.html";
    }
  });

  // Sample data untuk riwayat penjualan (replace dengan API call jika ada)
  const sampleSellHistory = [
    {
      date: "2026-06-22",
      quantity: 10.5,
      total: 63000,
      status: "ACCEPTED",
    },
    {
      date: "2026-06-20",
      quantity: 5.0,
      total: 30000,
      status: "PENDING",
    },
    {
      date: "2026-06-15",
      quantity: 15.0,
      total: 90000,
      status: "ACCEPTED",
    },
  ];

  const sampleBuyHistory = [
    {
      date: "2026-06-21",
      quantity: 20.0,
      total: 110000,
      status: "ACCEPTED",
    },
    {
      date: "2026-06-18",
      quantity: 30.0,
      total: 165000,
      status: "REJECTED",
    },
  ];

  const getStatusBadge = (status) => {
    const s = status.toUpperCase();
    if (s === "PENDING") return '<span class="badge badge-pending rounded-pill px-3 py-1">Pending</span>';
    if (s === "ACCEPTED") return '<span class="badge badge-accepted rounded-pill px-3 py-1">Accepted</span>';
    if (s === "REJECTED") return '<span class="badge badge-rejected rounded-pill px-3 py-1">Rejected</span>';
    return `<span class="badge bg-secondary rounded-pill px-3 py-1">${status}</span>`;
  };

  const renderTable = (data, tbodyId) => {
    const tbody = document.getElementById(tbodyId);
    if (!data || !data.length) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-muted">Tidak ada data</td></tr>`;
      return;
    }
    tbody.innerHTML = data
      .map(
        (item) => `
                    <tr>
                        <td class="ps-4">${new Date(item.date).toLocaleDateString("id-ID")}</td>
                        <td class="fw-bold">${parseFloat(item.quantity).toFixed(2)} L</td>
                        <td class="fw-bold">Rp ${item.total.toLocaleString("id-ID")}</td>
                        <td>${getStatusBadge(item.status)}</td>
                    </tr>
                `
      )
      .join("");
  };

  renderTable(sampleSellHistory, "sell-history-table");
  renderTable(sampleBuyHistory, "buy-history-table");
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initRiwayatPage);
