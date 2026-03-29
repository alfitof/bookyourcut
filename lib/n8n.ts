export type ReminderPayload = {
  bookingId: string;
  customerName: string;
  service: string;
  date: string;
  time: string;
  phone: string;
  clientName: string;
  chatId: string;
  reminderType: "h1_day" | "h1_hour";
  waitUntil: string;
};

export async function triggerReminder(payload: ReminderPayload) {
  const webhookUrl =
    process.env.N8N_WEBHOOK_URL ?? process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
  const secret = process.env.N8N_WEBHOOK_SECRET ?? "";

  if (!webhookUrl) return { success: false, reason: "no_webhook_url" };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": secret,
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log("n8n response:", res.status, text);

    if (!res.ok) throw new Error(`n8n error: ${res.status} - ${text}`);

    // ── Parse executionId dari response n8n ──
    let executionId: string | undefined;
    try {
      const json = JSON.parse(text);
      executionId = json.executionId ?? json.id;
    } catch {
      // Response bukan JSON — tidak ada executionId
    }

    return { success: true, executionId };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function cancelReminder(bookingId: string) {
  const cancelUrl =
    process.env.N8N_CANCEL_WEBHOOK_URL ??
    process.env.NEXT_PUBLIC_N8N_CANCEL_WEBHOOK_URL;
  const secret = process.env.N8N_WEBHOOK_SECRET ?? "";

  if (!cancelUrl) {
    console.warn(
      "N8N_CANCEL_WEBHOOK_URL not set — reminder will not be cancelled",
    );
    return { success: false, reason: "no_cancel_url" };
  }

  try {
    const res = await fetch(cancelUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": secret,
      },
      body: JSON.stringify({ bookingId, action: "cancel" }),
    });

    const text = await res.text();
    if (!res.ok) throw new Error(`n8n cancel error: ${res.status} - ${text}`);
    return { success: true };
  } catch (err) {
    console.error("cancelReminder error:", err);
    return { success: false, error: String(err) };
  }
}

export function calculateWaitTimes(dateStr: string, timeStr: string) {
  const months: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    Mei: 4,
    Jun: 5,
    Jul: 6,
    Agu: 7,
    Sep: 8,
    Okt: 9,
    Nov: 10,
    Des: 11,
  };

  const parts = dateStr.split(" ");
  const day = parseInt(parts[0]);
  const month = months[parts[1]] ?? 0;
  const year = parseInt(parts[2]);
  const [hour, minute] = timeStr.split(":").map(Number);

  function toWIBIso(
    y: number,
    mo: number,
    d: number,
    h: number,
    mi: number,
    s: number = 0,
  ): string {
    const pad = (n: number, len = 2) => String(n).padStart(len, "0");
    return `${pad(y, 4)}-${pad(mo + 1)}-${pad(d)}T${pad(h)}:${pad(mi)}:${pad(s)}+07:00`;
  }

  function dateToWIBIso(date: Date): string {
    const wibOffset = 7 * 60;
    const wibMs = date.getTime() + wibOffset * 60 * 1000;
    const wibDate = new Date(wibMs);
    const pad = (n: number, len = 2) => String(n).padStart(len, "0");
    return `${pad(wibDate.getUTCFullYear(), 4)}-${pad(wibDate.getUTCMonth() + 1)}-${pad(wibDate.getUTCDate())}T${pad(wibDate.getUTCHours())}:${pad(wibDate.getUTCMinutes())}:${pad(wibDate.getUTCSeconds())}+07:00`;
  }

  const bookingWIB = toWIBIso(year, month, day, hour, minute);
  const h1DayWIB = toWIBIso(year, month, day - 1, 8, 0);
  const h1HourDate = new Date(new Date(bookingWIB).getTime() - 60 * 60 * 1000);
  const h1HourWIB = dateToWIBIso(h1HourDate);

  return { bookingTime: bookingWIB, h1Day: h1DayWIB, h1Hour: h1HourWIB };
}
