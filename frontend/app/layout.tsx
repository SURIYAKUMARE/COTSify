import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import ClientOnlyWidgets from "@/components/ClientOnlyWidgets";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "COTsify – Smart Component Sourcing",
  description: "Identify, locate, and compare components for any technical project",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full`}>
      <body className="min-h-full bg-gray-950 text-gray-100 antialiased">
        <AuthProvider>
          <ToastProvider>
            <ClientOnlyWidgets />
            <Navbar />
            <main className="relative z-10">{children}</main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
