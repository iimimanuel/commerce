import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ReactQueryProvider from "../reactQueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Explore",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          {/* <SessionProvider value={session}>

          </SessionProvider> */}
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
