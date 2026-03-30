import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin-server";
import { FieldValue } from "firebase-admin/firestore";
import {
  triggerReminder,
  calculateWaitTimes,
  type ReminderPayload,
} from "@/lib/n8n";

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
    status: "scheduled" | "sent" | "failed" | "cancelled";
    executionId?: string;
    error?: string;
  },
) {
  const cleanData: Record<string, any> = {
    bookingId: data.bookingId,
    customerName: data.customerName,
    type: data.type,
    via: data.via,
    scheduledAt: data.scheduledAt,
    status: data.status,
    createdAt: FieldValue.serverTimestamp(),
  };
  if (data.executionId) cleanData.executionId = data.executionId;
  if (data.error) cleanData.error = data.error;

  await adminDb
    .collection("clients")
    .doc(uid)
    .collection("reminderLogs")
    .add(cleanData);
}

async function triggerN8nForBooking(
  bookingId: string,
  clientUid: string,
  booking: Record<string, any>,
  clientName: string,
) {
  const chatId = process.env.TELEGRAM_CHAT_ID ?? "";
  const { h1Day, h1Hour } = calculateWaitTimes(booking.date, booking.time);
  const now = new Date();
  const results = [];

  // ── H-1 Hari ──
  if (new Date(h1Day) > now) {
    const payload: ReminderPayload = {
      bookingId,
      customerName: booking.customerName,
      service: booking.service,
      date: booking.date,
      time: booking.time,
      phone: booking.phone ?? "",
      clientName,
      chatId,
      reminderType: "h1_day",
      waitUntil: h1Day,
    };

    console.log("Triggering H-1 Day:", payload);
    const r1 = await triggerReminder(payload);
    console.log("H-1 Day result:", r1);

    const logData1: Parameters<typeof addReminderLogAdmin>[1] = {
      bookingId,
      customerName: booking.customerName,
      type: "h1_day",
      via: "telegram",
      scheduledAt: h1Day,
      status: r1.success ? "scheduled" : "failed",
    };
    if (r1.executionId) logData1.executionId = r1.executionId;
    if (!r1.success && r1.error) logData1.error = String(r1.error);

    await addReminderLogAdmin(clientUid, logData1);
    results.push({ type: "h1_day", ...r1 });
  } else {
    console.log("H-1 Day skipped — time already passed:", h1Day);
    results.push({ type: "h1_day", skipped: true, reason: "time_passed" });
  }

  // ── Delay antar trigger ──
  await new Promise((resolve) => setTimeout(resolve, 400));

  // ── H-1 Jam ──
  if (new Date(h1Hour) > now) {
    const payload: ReminderPayload = {
      bookingId,
      customerName: booking.customerName,
      service: booking.service,
      date: booking.date,
      time: booking.time,
      phone: booking.phone ?? "",
      clientName,
      chatId,
      reminderType: "h1_hour",
      waitUntil: h1Hour,
    };

    console.log("Triggering H-1 Hour:", payload);
    const r2 = await triggerReminder(payload);
    console.log("H-1 Hour result:", r2);

    const logData2: Parameters<typeof addReminderLogAdmin>[1] = {
      bookingId,
      customerName: booking.customerName,
      type: "h1_hour",
      via: "telegram",
      scheduledAt: h1Hour,
      status: r2.success ? "scheduled" : "failed",
    };
    if (r2.executionId) logData2.executionId = r2.executionId;
    if (!r2.success && r2.error) logData2.error = String(r2.error);

    await addReminderLogAdmin(clientUid, logData2);
    results.push({ type: "h1_hour", ...r2 });
  } else {
    console.log("H-1 Hour skipped — time already passed:", h1Hour);
    results.push({ type: "h1_hour", skipped: true, reason: "time_passed" });
  }

  return results;
}

export async function POST(req: NextRequest) {
  try {
    const {
      bookingId,
      clientUid,
      newStatus,
      forceRetrigger, // ← flag baru untuk booking manual
    }: {
      bookingId: string;
      clientUid: string;
      newStatus: "confirmed" | "pending" | "completed" | "cancelled";
      forceRetrigger?: boolean;
    } = await req.json();

    if (!bookingId || !clientUid || !newStatus) {
      return NextResponse.json(
        { error: "Missing required fields: bookingId, clientUid, newStatus" },
        { status: 400 },
      );
    }

    // ── Ambil booking dari Firestore ──
    const bookingSnap = await adminDb
      .collection("clients")
      .doc(clientUid)
      .collection("bookings")
      .doc(bookingId)
      .get();

    if (!bookingSnap.exists) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const booking = bookingSnap.data()!;
    const oldStatus = booking.status as string;

    // ── Update status (skip jika forceRetrigger dan status sama) ──
    if (newStatus !== oldStatus) {
      await bookingSnap.ref.update({
        status: newStatus,
        updatedAt: FieldValue.serverTimestamp(),
      });
      console.log(`Booking ${bookingId}: ${oldStatus} → ${newStatus}`);
    } else {
      console.log(
        `Booking ${bookingId}: status tetap ${newStatus}${forceRetrigger ? " (forceRetrigger)" : ""}`,
      );
    }

    // ═══════════════════════════════════════════
    // CONFIRMED → trigger n8n
    // Kondisi: newStatus confirmed DAN
    //   (oldStatus bukan confirmed ATAU forceRetrigger = true)
    // ═══════════════════════════════════════════
    if (
      newStatus === "confirmed" &&
      (oldStatus !== "confirmed" || forceRetrigger === true)
    ) {
      const profile = await getClientProfileAdmin(clientUid);
      const clientName = profile?.businessName ?? "Barber Shop";

      const results = await triggerN8nForBooking(
        bookingId,
        clientUid,
        booking,
        clientName,
      );

      return NextResponse.json({
        success: true,
        action: forceRetrigger
          ? "force_retriggered"
          : "confirmed_and_triggered",
        results,
      });
    }

    // ═══════════════════════════════════════════
    // CANCELLED → stop n8n executions
    // ═══════════════════════════════════════════
    if (newStatus === "cancelled" && oldStatus !== "cancelled") {
      const logsSnap = await adminDb
        .collection("clients")
        .doc(clientUid)
        .collection("reminderLogs")
        .where("bookingId", "==", bookingId)
        .where("status", "==", "scheduled")
        .get();

      const n8nApiUrl = process.env.N8N_API_URL;
      const n8nApiKey = process.env.N8N_API_KEY;
      const cancelResults = [];

      for (const logDoc of logsSnap.docs) {
        const logData = logDoc.data();

        if (logData.executionId && n8nApiUrl && n8nApiKey) {
          try {
            const res = await fetch(
              `${n8nApiUrl}/executions/${logData.executionId}/stop`,
              {
                method: "POST",
                headers: { "X-N8N-API-KEY": n8nApiKey },
              },
            );
            console.log(`Stop execution ${logData.executionId}: ${res.status}`);
            cancelResults.push({
              executionId: logData.executionId,
              stopped: res.ok,
            });
          } catch (err) {
            console.error("Failed to stop execution:", err);
          }
        }

        await logDoc.ref.update({
          status: "cancelled",
          cancelledAt: FieldValue.serverTimestamp(),
        });
      }

      const cancelWebhookUrl = process.env.N8N_CANCEL_WEBHOOK_URL;
      const secret = process.env.N8N_WEBHOOK_SECRET ?? "";

      if (cancelWebhookUrl) {
        fetch(cancelWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": secret,
          },
          body: JSON.stringify({
            bookingId,
            customerName: booking.customerName,
            service: booking.service,
            date: booking.date,
            time: booking.time,
            clientUid,
            action: "cancel",
          }),
        }).catch((e) => console.error("Cancel webhook error:", e));
      }

      return NextResponse.json({
        success: true,
        action: "cancelled",
        logsUpdated: logsSnap.size,
        cancelResults,
      });
    }

    return NextResponse.json({
      success: true,
      action: `status_updated_to_${newStatus}`,
    });
  } catch (err: any) {
    console.error("update-booking-status error:", err);
    return NextResponse.json(
      { error: err.message ?? "Internal error" },
      { status: 500 },
    );
  }
}
