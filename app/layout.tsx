import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Poppins } from "next/font/google";
import NavBar from "@/components/navigation";
import { Analytics } from "@vercel/analytics/react";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const hideButton = false;

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
      <body className={poppins.className}>
        <NavBar hideButton={hideButton} />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
