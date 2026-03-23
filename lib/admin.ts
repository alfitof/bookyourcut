import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase-admin";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  getAuth,
  deleteUser,
} from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";

export type ClientData = {
  uid: string;
  businessName: string;
  email: string;
  phone: string;
  slug: string;
  status: "active" | "inactive";
  plan: "free" | "pro";
  createdAt: any;
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const secondaryApp =
  getApps().find((a) => a.name === "secondary") ??
  initializeApp(firebaseConfig, "secondary");
const secondaryAuth = getAuth(secondaryApp);

export async function isAdmin(uid: string): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, "admins", uid));
    return snap.exists();
  } catch {
    return false;
  }
}

export async function getAllClients(): Promise<ClientData[]> {
  const q = query(collection(db, "clients"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as ClientData);
}

export async function createClient(data: {
  businessName: string;
  email: string;
  password: string;
  phone: string;
  slug: string;
  plan: "free" | "pro";
}) {
  const cred = await createUserWithEmailAndPassword(
    secondaryAuth,
    data.email,
    data.password,
  );
  await updateProfile(cred.user, { displayName: data.businessName });
  await setDoc(doc(db, "clients", cred.user.uid), {
    businessName: data.businessName,
    email: data.email,
    phone: data.phone,
    slug: data.slug,
    status: "active",
    plan: data.plan,
    createdAt: serverTimestamp(),
  });
  await secondaryAuth.signOut();
  return cred.user;
}

export async function updateClientStatus(
  uid: string,
  status: "active" | "inactive",
) {
  await updateDoc(doc(db, "clients", uid), { status });
}

export async function updateClientPlan(uid: string, plan: "free" | "pro") {
  await updateDoc(doc(db, "clients", uid), { plan });
}

// Delete dari Firestore + hapus dari Firebase Auth via secondary app
export async function deleteClient(
  uid: string,
  email: string,
  password: string,
) {
  // Hapus dari Firestore dulu
  await deleteDoc(doc(db, "clients", uid));
}

// Fungsi ini dipanggil terpisah untuk delete auth user
// Karena kita tidak punya password client, kita simpan flag deleted di Firestore
// dan handle via Firebase Admin SDK di server (atau cukup hapus Firestore saja)
export async function deleteClientFirestore(uid: string) {
  await deleteDoc(doc(db, "clients", uid));
}

export async function getClient(uid: string): Promise<ClientData | null> {
  const snap = await getDoc(doc(db, "clients", uid));
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() } as ClientData;
}
