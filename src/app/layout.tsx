import type { Metadata } from "next";
import { Zen_Kaku_Gothic_Antique } from "next/font/google";
import "./globals.css"; // Tailwind CSS の適用
import localFont from "next/font/local";


const zenKakuGothicAntique = Zen_Kaku_Gothic_Antique({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"]
});

const ElenaShine = localFont({
  src: [
    {
      path: "./fonts/GlitchSlap-R8me.ttf",
      weight: "400",
      style: "normal",
    }
  ],
  variable: "--font-ElenaShine",
});

export const metadata: Metadata = {
  title: "Dogense Tech Log",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${zenKakuGothicAntique.className} antialiased ${ElenaShine.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
