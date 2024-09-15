import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateRequest();

  if (user)
    if (user.role == ("SUPER_ADMIN" || "ADMIN")) {
      redirect("/dashboard");
    } 

  return <>{children}</>;
}
