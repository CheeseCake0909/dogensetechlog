import type { Metadata } from "next";
import { Zen_Kaku_Gothic_Antique } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import Script from "next/script";

const zenKakuGothicAntique = Zen_Kaku_Gothic_Antique({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

const ElenaShine = localFont({
  src: [
    {
      path: "./fonts/GlitchSlap-R8me.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-ElenaShine",
});

export const metadata: Metadata = {
  title: "Home | Dogense Tech Log",
  description: "Dogense Tech Logのホームページです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
        {`
          try {
            const theme = localStorage.getItem('theme');
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (theme === 'dark' || (!theme && systemPrefersDark)) {
              document.documentElement.classList.add('dark');
            }
          } catch (e) {}
        `}
        </Script>
      </head>
      <body
        className={`${zenKakuGothicAntique.className} antialiased ${ElenaShine.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
