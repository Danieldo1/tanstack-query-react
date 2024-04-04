import type { Metadata } from "next";
import { Inter, Rubik_Scribble } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });
const rubik = Rubik_Scribble({ subsets: ["latin"], weight: "400", variable: "--rubik-font" });

export const metadata: Metadata = {
  title: "FiltrationMitigation",
  description:
    "A self introduction to use of filter system on products using TanStack Query",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${rubik.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
