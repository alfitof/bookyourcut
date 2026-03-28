import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase-admin";
import { ClientData } from "./admin";

// ── TYPES ──────────────────────────────────────────

export type Service = {
  id: string;
  name: string;
  duration: string;
  price: string;
  bookingCount: number;
  color: string;
  createdAt?: any;
};

export type Booking = {
  id: string;
  customerName: string;
  service: string;
  date: string;
  time: string;
  phone: string;
  email?: string;
  note?: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  duration: string;
  price: string;
  createdAt?: any;
};

export type DayAvailability = {
  enabled: boolean;
  start: string;
  end: string;
  breakStart: string;
  breakEnd: string;
};

export type Availability = Record<string, DayAvailability>;

// ── SERVICES ───────────────────────────────────────

export async function getServices(uid: string): Promise<Service[]> {
  const q = query(
    collection(db, "clients", uid, "services"),
    orderBy("createdAt", "asc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Service);
}

export async function addService(uid: string, data: Omit<Service, "id">) {
  const ref = await addDoc(collection(db, "clients", uid, "services"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateService(
  uid: string,
  serviceId: string,
  data: Partial<Service>,
) {
  await updateDoc(doc(db, "clients", uid, "services", serviceId), data);
}

export async function deleteService(uid: string, serviceId: string) {
  await deleteDoc(doc(db, "clients", uid, "services", serviceId));
}

// ── BOOKINGS ───────────────────────────────────────

export async function getBookings(uid: string): Promise<Booking[]> {
  const q = query(
    collection(db, "clients", uid, "bookings"),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Booking);
}

export async function addBooking(uid: string, data: Omit<Booking, "id">) {
  const ref = await addDoc(collection(db, "clients", uid, "bookings"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateBookingStatus(
  uid: string,
  bookingId: string,
  status: Booking["status"],
) {
  await updateDoc(doc(db, "clients", uid, "bookings", bookingId), { status });
}

export async function deleteBooking(uid: string, bookingId: string) {
  await deleteDoc(doc(db, "clients", uid, "bookings", bookingId));
}

// ── AVAILABILITY ───────────────────────────────────

const DEFAULT_AVAILABILITY: Availability = {
  Senin: {
    enabled: true,
    start: "09:00",
    end: "17:00",
    breakStart: "12:00",
    breakEnd: "13:00",
  },
  Selasa: {
    enabled: true,
    start: "09:00",
    end: "17:00",
    breakStart: "12:00",
    breakEnd: "13:00",
  },
  Rabu: {
    enabled: true,
    start: "09:00",
    end: "17:00",
    breakStart: "12:00",
    breakEnd: "13:00",
  },
  Kamis: {
    enabled: true,
    start: "09:00",
    end: "17:00",
    breakStart: "12:00",
    breakEnd: "13:00",
  },
  Jumat: {
    enabled: true,
    start: "09:00",
    end: "17:00",
    breakStart: "11:30",
    breakEnd: "13:30",
  },
  Sabtu: {
    enabled: true,
    start: "09:00",
    end: "15:00",
    breakStart: "",
    breakEnd: "",
  },
  Minggu: {
    enabled: false,
    start: "09:00",
    end: "17:00",
    breakStart: "",
    breakEnd: "",
  },
};

export async function getAvailability(uid: string): Promise<Availability> {
  const snap = await getDoc(
    doc(db, "clients", uid, "settings", "availability"),
  );
  if (!snap.exists()) return DEFAULT_AVAILABILITY;
  return snap.data() as Availability;
}

export async function saveAvailability(uid: string, data: Availability) {
  await setDoc(doc(db, "clients", uid, "settings", "availability"), data);
}

// ── PROFILE ────────────────────────────────────────

export type ClientProfile = {
  businessName: string;
  email: string;
  phone: string;
  slug: string;
  address?: string;
};

export async function getClientProfile(
  uid: string,
): Promise<ClientProfile | null> {
  const snap = await getDoc(doc(db, "clients", uid));
  if (!snap.exists()) return null;
  return snap.data() as ClientProfile;
}

export async function updateClientProfile(
  uid: string,
  data: Partial<ClientProfile>,
) {
  await updateDoc(doc(db, "clients", uid), data);
}

// lib/firestore.ts — tambah fungsi
export async function getClientBySlug(slug: string) {
  const q = query(collection(db, "clients"), where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { uid: doc.id, ...doc.data() } as ClientData & { uid: string };
}

export async function addPublicBooking(uid: string, data: Omit<Booking, "id">) {
  const ref = await addDoc(collection(db, "clients", uid, "bookings"), {
    ...data,
    status: "pending",
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function triggerBookingReminder(params: {
  bookingId: string;
  customerName: string;
  service: string;
  date: string;
  time: string;
  phone: string;
  clientUid: string;
}) {
  try {
    const res = await fetch("/api/trigger-reminder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    console.log("Reminder trigger response:", data);
    return data;
  } catch (err) {
    console.error("Failed to trigger reminder:", err);
  }
}

export type ReminderLog = {
  id: string;
  bookingId: string;
  customerName: string;
  type: "h1_day" | "h1_hour";
  via: string;
  scheduledAt: string;
  status: "scheduled" | "sent" | "failed";
  createdAt?: any;
};

export async function getReminderLogs(uid: string): Promise<ReminderLog[]> {
  const q = query(
    collection(db, "clients", uid, "reminderLogs"),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ReminderLog);
}

export async function addReminderLog(
  uid: string,
  data: Omit<ReminderLog, "id">,
) {
  await addDoc(collection(db, "clients", uid, "reminderLogs"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}
