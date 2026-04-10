import type { Metadata, Viewport } from "next";
import { Roboto, Roboto_Serif, Schoolbell } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-roboto",
});

const robotoSerif = Roboto_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-serif",
});

const schoolbell = Schoolbell({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-schoolbell",
});

export const metadata: Metadata = {
  title: {
    default: "Olivia Tran - Product Design",
    template: "%s",
  },
  description:
    "Portfolio of Olivia Tran - UX design, research, and product design across internship, academic, and hackathon work.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${roboto.variable} ${robotoSerif.variable} ${schoolbell.variable}`}
    >
      <body
        className={`min-h-full flex flex-col cursor-red-circle ${roboto.className}`}
      >
        {children}
      </body>
    </html>
  );
}
