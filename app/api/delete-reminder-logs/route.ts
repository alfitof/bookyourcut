import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin-server";
import { FieldValue } from "firebase-admin/firestore";

export async function DELETE(req: NextRequest) {
  try {
    const { clientUid, singleLogId } = await req.json();

    if (!clientUid) {
      return NextResponse.json({ error: "Missing clientUid" }, { status: 400 });
    }

    // ── Ambil semua logs ──
    const logsSnap = await adminDb
      .collection("clients")
      .doc(clientUid)
      .collection("reminderLogs")
      .get();

    const n8nApiUrl = process.env.N8N_API_URL;
    const n8nApiKey = process.env.N8N_API_KEY;
    const stopResults = [];

    if (singleLogId) {
      // Hapus satu log + stop execution-nya
      const logDoc = await adminDb
        .collection("clients")
        .doc(clientUid)
        .collection("reminderLogs")
        .doc(singleLogId)
        .get();

      if (logDoc.exists) {
        const data = logDoc.data()!;
        if (
          data.status === "scheduled" &&
          data.executionId &&
          n8nApiUrl &&
          n8nApiKey
        ) {
          await fetch(`${n8nApiUrl}/executions/${data.executionId}/stop`, {
            method: "POST",
            headers: { "X-N8N-API-KEY": n8nApiKey },
          }).catch(console.error);
        }
        // Tidak perlu delete di sini, client SDK yang handle
      }

      return NextResponse.json({ success: true });
    }

    // ── Stop semua yang masih scheduled ──
    for (const logDoc of logsSnap.docs) {
      const data = logDoc.data();
      if (
        data.status === "scheduled" &&
        data.executionId &&
        n8nApiUrl &&
        n8nApiKey
      ) {
        try {
          const res = await fetch(
            `${n8nApiUrl}/executions/${data.executionId}/stop`,
            {
              method: "POST",
              headers: { "X-N8N-API-KEY": n8nApiKey },
            },
          );
          console.log(`Stop execution ${data.executionId}: ${res.status}`);
          stopResults.push({ executionId: data.executionId, stopped: res.ok });
        } catch (err) {
          console.error("Stop execution error:", err);
        }
      }
    }

    // ── Hapus semua logs dalam batch ──
    const batchSize = 500; // Firestore batch limit
    const docs = logsSnap.docs;

    for (let i = 0; i < docs.length; i += batchSize) {
      const batch = adminDb.batch();
      docs.slice(i, i + batchSize).forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }

    return NextResponse.json({
      success: true,
      deleted: docs.length,
      stopResults,
    });
  } catch (err: any) {
    console.error("delete-reminder-logs error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
