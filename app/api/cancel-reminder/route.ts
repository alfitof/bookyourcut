import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin-server";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const { bookingId, clientUid } = await req.json();

    if (!bookingId || !clientUid) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // ── Ambil execution IDs dari reminder logs ──
    const logsSnap = await adminDb
      .collection("clients")
      .doc(clientUid)
      .collection("reminderLogs")
      .where("bookingId", "==", bookingId)
      .where("status", "==", "scheduled")
      .get();

    const n8nApiUrl = process.env.N8N_API_URL; // e.g. http://localhost:5678/api/v1
    const n8nApiKey = process.env.N8N_API_KEY;

    const cancelResults = [];

    for (const logDoc of logsSnap.docs) {
      const logData = logDoc.data();

      // ── Cancel via n8n REST API jika ada executionId ──
      if (logData.executionId && n8nApiUrl && n8nApiKey) {
        try {
          const res = await fetch(
            `${n8nApiUrl}/executions/${logData.executionId}/stop`,
            {
              method: "POST",
              headers: { "X-N8N-API-KEY": n8nApiKey },
            },
          );
          console.log(`Cancel execution ${logData.executionId}:`, res.status);
          cancelResults.push({
            executionId: logData.executionId,
            status: res.status,
          });
        } catch (err) {
          console.error("Failed to cancel execution:", err);
        }
      }

      // ── Update log status ke cancelled ──
      await logDoc.ref.update({
        status: "cancelled",
        cancelledAt: FieldValue.serverTimestamp(),
      });
    }

    // ── Kirim notif cancel ke Telegram (opsional) ──
    const cancelWebhookUrl = process.env.N8N_CANCEL_WEBHOOK_URL;
    const secret = process.env.N8N_WEBHOOK_SECRET ?? "";

    if (cancelWebhookUrl) {
      await fetch(cancelWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": secret },
        body: JSON.stringify({ bookingId, action: "cancel" }),
      }).catch((e) => console.error("Cancel webhook error:", e));
    }

    return NextResponse.json({
      success: true,
      cancelled: cancelResults.length,
    });
  } catch (err: any) {
    console.error("Cancel reminder error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
