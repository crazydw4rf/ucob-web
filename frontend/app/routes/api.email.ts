import { ActionFunctionArgs } from "react-router";
import { sendEmail } from "../lib/mailer.server";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const data = await request.json();
    const { to, eventType, transactionId, status, details } = data;

    if (!to) {
      return Response.json({ error: "Missing recipient email" }, { status: 400 });
    }

    let subject = "Pembaruan Transaksi UCOB";
    let html = "<p>Transaksi Anda telah diperbarui.</p>";

    if (eventType === "created") {
      subject = `[UCOB] Transaksi TRX-${String(transactionId).padStart(4, "0")} Berhasil Dibuat`;
      html = `
        <h2>Transaksi Berhasil Dibuat</h2>
        <p>Halo, transaksi Anda (TRX-${String(transactionId).padStart(4, "0")}) telah berhasil kami catat di sistem.</p>
        <p><strong>Detail:</strong> ${details || "-"}</p>
        <p>Tim kami akan segera memproses transaksi Anda. Terima kasih telah menggunakan UCOB!</p>
      `;
    } else if (eventType === "status_update") {
      subject = `[UCOB] Status Transaksi TRX-${String(transactionId).padStart(4, "0")} telah menjadi ${status}`;
      html = `
        <h2>Pembaruan Status Transaksi</h2>
        <p>Halo, status transaksi Anda (TRX-${String(transactionId).padStart(4, "0")}) telah diperbarui menjadi: <strong>${status}</strong>.</p>
        <p>Terima kasih telah mempercayakan transaksi minyak bekas Anda kepada UCOB!</p>
      `;
    }

    await sendEmail({
      to,
      subject,
      text: "Silakan lihat email ini menggunakan email client yang mendukung HTML.",
      html,
    });

    return Response.json({ success: true });
  } catch (err: any) {
    console.error("Email sending failed:", err);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
