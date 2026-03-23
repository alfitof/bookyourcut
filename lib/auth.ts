import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";
import {
  createSession,
  createAdminSession,
  deleteSession,
  deleteAdminSession,
} from "./session";
import { isAdmin } from "./admin";

// Login khusus admin — akan error kalau bukan admin
export async function loginAsAdmin(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);

  console.log("UID yang login:", cred.user.uid); // ← tambah ini

  const admin = await isAdmin(cred.user.uid);
  console.log("isAdmin result:", admin);

  if (!admin) {
    // sign out dulu supaya tidak ada session yang tersisa
    await signOut(auth);
    throw new Error("NOT_ADMIN");
  }

  const token = await cred.user.getIdToken();
  await deleteSession();
  await createAdminSession(token);
  return cred.user;
}

// Login khusus client — akan error kalau ternyata admin
export async function loginAsClient(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const admin = await isAdmin(cred.user.uid);

  if (admin) {
    await signOut(auth);
    throw new Error("IS_ADMIN");
  }

  const token = await cred.user.getIdToken();
  await deleteAdminSession();
  await createSession(token);
  return cred.user;
}

export async function logoutUser() {
  await signOut(auth);
  await deleteSession();
  await deleteAdminSession();
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
