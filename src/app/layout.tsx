import type { Metadata } from "next";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import localFont from "next/font/local";
import "./globals.css";

const caviarDreams = localFont({
  src: "../assets/CaviarDreams_Bold.ttf",
  variable: "--font-brand",
});

export const metadata: Metadata = {
  title: "Canopy",
  description: "Organize your web with style.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${caviarDreams.variable} antialiased`}>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
