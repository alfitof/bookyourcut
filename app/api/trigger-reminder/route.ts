import { NextRequest, NextResponse } from "next/server";
import {
  triggerReminder,
  calculateWaitTimes,
  type ReminderPayload,
} from "@/lib/n8n";
import { adminDb } from "@/lib/firebase-admin-server";
import { FieldValue } from "firebase-admin/firestore";

// Ambil profile client via Admin SDK
async function getClientProfileAdmin(uid: string) {
  const snap = await adminDb.collection("clients").doc(uid).get();
  if (!snap.exists) return null;
  return snap.data() as { businessName?: string; slug?: string };
}

// Simpan reminder log via Admin SDK
async function addReminderLogAdmin(
  uid: string,
  data: {
    bookingId: string;
    customerName: string;
    type: "h1_day" | "h1_hour";
    via: string;
    scheduledAt: string;
    status: "scheduled" | "sent" | "failed";
  },
) {
  await adminDb
    .collection("clients")
    .doc(uid)
    .collection("reminderLogs")
    .add({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
    });
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

    // ── Ambil data client via Admin SDK (no permission issue) ──
    const profile = await getClientProfileAdmin(clientUid);
    const clientName = profile?.businessName ?? "Barber Shop";
    const chatId = process.env.TELEGRAM_CHAT_ID ?? "";

    const { h1Day, h1Hour } = calculateWaitTimes(date, time);
    const now = new Date();

    console.log("Booking time info:", {
      h1Day,
      h1Hour,
      now: now.toISOString(),
    });

    const results = [];

    // ── Trigger H-1 Hari ──
    const payloadH1Day: ReminderPayload = {
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

    if (new Date(h1Day) > now) {
      const r1 = await triggerReminder(payloadH1Day);
      console.log("H-1 Day result:", r1);

      // Log ke Firestore via Admin SDK
      await addReminderLogAdmin(clientUid, {
        bookingId,
        customerName,
        type: "h1_day",
        via: "telegram",
        scheduledAt: h1Day,
        status: r1.success ? "scheduled" : "failed",
      });

      results.push({ type: "h1_day", ...r1 });
    } else {
      console.log("H-1 Day skipped — already passed:", h1Day);
      results.push({ type: "h1_day", skipped: true });
    }

    // ── Trigger H-1 Jam ──
    const payloadH1Hour: ReminderPayload = {
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

    if (new Date(h1Hour) > now) {
      const r2 = await triggerReminder(payloadH1Hour);
      console.log("H-1 Hour result:", r2);

      await addReminderLogAdmin(clientUid, {
        bookingId,
        customerName,
        type: "h1_hour",
        via: "telegram",
        scheduledAt: h1Hour,
        status: r2.success ? "scheduled" : "failed",
      });

      results.push({ type: "h1_hour", ...r2 });
    } else {
      console.log("H-1 Hour skipped — already passed:", h1Hour);
      results.push({ type: "h1_hour", skipped: true });
    }

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    console.error("Trigger reminder error:", err);
    return NextResponse.json(
      { error: err.message ?? "Internal error" },
      { status: 500 },
    );
  }
}
