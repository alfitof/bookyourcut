import type { Metadata } from "next";
import "./global.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "BookYourCut — Booking & Reminder Otomatis",
  description: "Sistem booking modern untuk barber shop.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
