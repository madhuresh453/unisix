import PDFDocument from "pdfkit";
import { CTF } from "../models/CTF.js";
import { User } from "../models/User.js";
import { buildEventLeaderboardRows } from "./leaderboardService.js";

export async function generateCertificate({ userId, ctfId }) {
  const [user, ctf, leaderboard] = await Promise.all([
    User.findById(userId).lean(),
    CTF.findById(ctfId).lean(),
    buildEventLeaderboardRows(ctfId, 500)
  ]);

  if (!user || !ctf) {
    const error = new Error("Certificate target not found.");
    error.statusCode = 404;
    throw error;
  }

  const row = leaderboard.find((item) => item.user === user.handle);
  const rank = row?.rank || "participant";

  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 48 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#0a0a0a");
    doc.strokeColor("#ff0033").lineWidth(4).rect(28, 28, doc.page.width - 56, doc.page.height - 56).stroke();
    doc.fillColor("#ff0033").fontSize(18).text("UNI6CTF", { align: "center" });
    doc.moveDown(2);
    doc.fillColor("#ffffff").fontSize(34).text("Certificate of Achievement", { align: "center" });
    doc.moveDown(1.5);
    doc.fillColor("#9ca3af").fontSize(16).text("Awarded to", { align: "center" });
    doc.moveDown(0.5);
    doc.fillColor("#ffffff").fontSize(42).text(user.name, { align: "center" });
    doc.moveDown(0.8);
    doc.fillColor("#9ca3af").fontSize(18).text(`For participating in ${ctf.name}`, { align: "center" });
    doc.moveDown(0.5);
    doc.fillColor("#ff0033").fontSize(22).text(`Rank: ${rank}`, { align: "center" });
    doc.end();
  });
}
