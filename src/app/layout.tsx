import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nimbus — Current conditions, read at a glance",
  description: "A responsive weather web application showing current conditions at a glance.",
  authors: [{ name: "Harshal S" }],
  openGraph: {
    title: "Nimbus — Current conditions, read at a glance",
    description: "A responsive weather web application showing current conditions at a glance.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0ea5e9",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="author" content="Harshal S" />
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}