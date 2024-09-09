import "./globals.css";
import { Poppins } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { Provider } from "@/app/providers/index";

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
  openGraph: {
    title: "WanderAI",
    description:
      "Love travel but hate planning? Plan your next adventure in seconds through the power of AI",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <Provider>
        <body className={`${GeistSans.variable} ${poppins.variable}`}>
          {children}
        </body>
      </Provider>
    </html>
  );
}
