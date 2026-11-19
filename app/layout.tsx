import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clan HQ",
  description:
    "Clash of Clans clan hub — recruiting front door + live war & member stats.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Display font loaded at runtime so the build never depends on a font fetch.
            TODO: self-host via next/font for production once the build env allows it. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lilita+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-warroom flex min-h-full flex-col">{children}</body>
    </html>
  );
}
