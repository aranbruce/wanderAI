import "./globals.css";
import { Poppins } from "next/font/google";
import { GeistSans } from "geist/font/sans";

import Navigation from "@/components/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "WanderAI",
  description:
    "Love travel but hate planning? Plan your next adventure in seconds through the power of AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${GeistSans.variable} ${poppins.variable}`}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
