import { NextRequest, NextResponse } from "next/server";
import {
  triggerReminder,
  calculateWaitTimes,
  type ReminderPayload,
} from "@/lib/n8n";
import { adminDb } from "@/lib/firebase-admin-server";
import { FieldValue } from "firebase-admin/firestore";

async function getClientProfileAdmin(uid: string) {
  try {
    const snap = await adminDb.collection("clients").doc(uid).get();
    if (!snap.exists) return null;
    return snap.data() as { businessName?: string };
  } catch {
    return null;
  }
}

async function addReminderLogAdmin(
  uid: string,
  data: {
    bookingId: string;
    customerName: string;
    type: "h1_day" | "h1_hour";
    via: string;
    scheduledAt: string;
    status: "scheduled" | "sent" | "failed";
    error?: string;
  },
) {
  try {
    await adminDb
      .collection("clients")
      .doc(uid)
      .collection("reminderLogs")
      .add({ ...data, createdAt: FieldValue.serverTimestamp() });
  } catch (err) {
    console.error("Failed to save reminder log:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("=== Trigger Reminder ===");
    console.log("Body:", JSON.stringify(body, null, 2));

    const { bookingId, customerName, service, date, time, phone, clientUid } =
      body;

    if (!bookingId || !customerName || !date || !time || !clientUid) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const profile = await getClientProfileAdmin(clientUid);
    const clientName = profile?.businessName ?? "Barber Shop";
    const chatId = process.env.TELEGRAM_CHAT_ID ?? "";

    // ── Cek apakah n8n URL tersedia ──
    const n8nUrl =
      process.env.N8N_WEBHOOK_URL ?? process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

    if (!n8nUrl) {
      console.warn(
        "N8N_WEBHOOK_URL not configured — skipping reminder trigger",
      );
      return NextResponse.json({
        success: true,
        message: "Booking saved. Reminder skipped (n8n not configured).",
        results: [],
      });
    }

    const { h1Day, h1Hour } = calculateWaitTimes(date, time);
    const now = new Date();

    console.log("Times:", { h1Day, h1Hour, now: now.toISOString() });

    const results = [];

    // ── H-1 Hari ──
    if (new Date(h1Day) > now) {
      const payload: ReminderPayload = {
        bookingId,
        customerName,
        service,
        date,
        time,
        phone,
        clientName,
        chatId,
        reminderType: "h1_day",
        waitUntil: h1Day,
      };

      const r1 = await triggerReminder(payload);
      console.log("H-1 Day:", r1);

      await addReminderLogAdmin(clientUid, {
        bookingId,
        customerName,
        type: "h1_day",
        via: "telegram",
        scheduledAt: h1Day,
        status: r1.success ? "scheduled" : "failed",
        error: r1.success ? undefined : String(r1.error ?? ""),
      });

      results.push({ type: "h1_day", ...r1 });
    } else {
      console.log("H-1 Day skipped — already passed");
      results.push({ type: "h1_day", skipped: true, reason: "time_passed" });
    }

    // ── H-1 Jam ──
    if (new Date(h1Hour) > now) {
      const payload: ReminderPayload = {
        bookingId,
        customerName,
        service,
        date,
        time,
        phone,
        clientName,
        chatId,
        reminderType: "h1_hour",
        waitUntil: h1Hour,
      };

      const r2 = await triggerReminder(payload);
      console.log("H-1 Hour:", r2);

      await addReminderLogAdmin(clientUid, {
        bookingId,
        customerName,
        type: "h1_hour",
        via: "telegram",
        scheduledAt: h1Hour,
        status: r2.success ? "scheduled" : "failed",
        error: r2.success ? undefined : String(r2.error ?? ""),
      });

      results.push({ type: "h1_hour", ...r2 });
    } else {
      console.log("H-1 Hour skipped — already passed");
      results.push({ type: "h1_hour", skipped: true, reason: "time_passed" });
    }

    // ── Return success meski reminder gagal ──
    // Booking tetap tersimpan, reminder adalah best-effort
    const allFailed = results.every((r: any) => r.success === false);

    return NextResponse.json({
      success: true,
      bookingSaved: true,
      reminderStatus: allFailed ? "failed" : "triggered",
      results,
    });
  } catch (err: any) {
    console.error("Trigger reminder error:", err);
    return NextResponse.json({
      success: true,
      bookingSaved: true,
      error: err.message,
    });
  }
}
