import "./globals.css";
import { Barlow, Montserrat } from "next/font/google";
import Header from "@/components/navbar";
import Navbar from "@/components/footer";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["600"], // SemiBold
  variable: "--font-barlow",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400"], // Regular
  variable: "--font-montserrat",
});

export const metadata = {
  title: "My App",
  description: "Next.js app with Tailwind and layout setup",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body  className={`${barlow.variable} ${montserrat.variable} antialiased`}>
        <Header />
        <main className="min-h-screen min-w-screen">{children}</main>
        <Navbar/>
      </body>
    </html>
  );
}
