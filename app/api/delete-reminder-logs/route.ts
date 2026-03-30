import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin-server";

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientUid, singleLogId } = body;

    if (!clientUid) {
      return NextResponse.json({ error: "Missing clientUid" }, { status: 400 });
    }

    const n8nApiUrl = process.env.N8N_API_URL;
    const n8nApiKey = process.env.N8N_API_KEY;

    async function stopExecution(executionId: string) {
      if (!n8nApiUrl || !n8nApiKey || !executionId) return;
      try {
        const res = await fetch(`${n8nApiUrl}/executions/${executionId}/stop`, {
          method: "POST",
          headers: { "X-N8N-API-KEY": n8nApiKey },
        });
        console.log(`Stop execution ${executionId}: ${res.status}`);
      } catch (err) {
        console.error("Stop execution error:", err);
      }
    }

    // ── SINGLE: stop 1 execution + client SDK yang hapus ──
    if (singleLogId) {
      const logDoc = await adminDb
        .collection("clients")
        .doc(clientUid)
        .collection("reminderLogs")
        .doc(singleLogId)
        .get();

      if (logDoc.exists) {
        const data = logDoc.data()!;
        if (data.executionId && data.status === "scheduled") {
          await stopExecution(data.executionId);
        }
      }
      // Client SDK yang hapus document-nya (sudah di-handle di frontend)
      return NextResponse.json({ success: true, action: "single_stopped" });
    }

    // ── ALL: stop semua + hapus semua via batch ──
    const logsSnap = await adminDb
      .collection("clients")
      .doc(clientUid)
      .collection("reminderLogs")
      .get();

    const stopResults = [];

    for (const logDoc of logsSnap.docs) {
      const data = logDoc.data();
      if (data.executionId && data.status === "scheduled") {
        await stopExecution(data.executionId);
        stopResults.push(data.executionId);
      }
    }

    // Hapus semua dalam batch
    const docs = logsSnap.docs;
    const batchSize = 500;

    for (let i = 0; i < docs.length; i += batchSize) {
      const batch = adminDb.batch();
      docs.slice(i, i + batchSize).forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }

    return NextResponse.json({
      success: true,
      action: "all_deleted",
      deleted: docs.length,
      stopped: stopResults.length,
      stopResults,
    });
  } catch (err: any) {
    console.error("delete-reminder-logs error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
