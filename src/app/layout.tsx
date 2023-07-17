import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { SessionProvider } from "~/components/providers/session-provider";
import { ThemeProvider } from "~/components/providers/theme-provider";

export const metadata = {
  title: "Vercel Postgres Demo with Drizzle",
  description:
    "A simple Next.js app with Vercel Postgres as the database and Drizzle as the ORM",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
