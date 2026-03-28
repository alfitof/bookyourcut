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
  waitUntil: string; // ISO string
};

export async function triggerReminder(payload: ReminderPayload) {
  const webhookUrl =
    process.env.N8N_WEBHOOK_URL ?? process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
  const secret = process.env.N8N_WEBHOOK_SECRET ?? "";

  console.log("Webhook URL:", webhookUrl);

  if (!webhookUrl) {
    console.warn("N8N_WEBHOOK_URL not set");
    return { success: false, reason: "no_webhook_url" };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": secret, // ← ganti dari x-webhook-secret ke x-api-key
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log("n8n status:", res.status, "| body:", text);

    if (!res.ok) {
      throw new Error(`n8n error: ${res.status} - ${text}`);
    }

    return { success: true };
  } catch (err) {
    console.error("triggerReminder error:", err);
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

  // Waktu booking dalam WIB
  const bookingWIB = toWIBIso(year, month, day, hour, minute);
  const h1DayWIB = toWIBIso(year, month, day - 1, 8, 0);
  const bookingDate = new Date(bookingWIB);
  const h1HourDate = new Date(bookingDate.getTime() - 60 * 60 * 1000);

  function dateToWIBIso(date: Date): string {
    const wibOffset = 7 * 60;
    const utcMs = date.getTime();
    const wibMs = utcMs + wibOffset * 60 * 1000;
    const wibDate = new Date(wibMs);

    const pad = (n: number, len = 2) => String(n).padStart(len, "0");
    const y = wibDate.getUTCFullYear();
    const mo = wibDate.getUTCMonth();
    const d = wibDate.getUTCDate();
    const h = wibDate.getUTCHours();
    const mi = wibDate.getUTCMinutes();
    const s = wibDate.getUTCSeconds();

    return `${pad(y, 4)}-${pad(mo + 1)}-${pad(d)}T${pad(h)}:${pad(mi)}:${pad(s)}+07:00`;
  }

  const h1HourWIB = dateToWIBIso(h1HourDate);
  return {
    bookingTime: bookingWIB,
    h1Day: h1DayWIB,
    h1Hour: h1HourWIB,
  };
}
