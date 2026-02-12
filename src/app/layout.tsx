import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SimTrader",
  description: "Fast-paced simulation trading game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
