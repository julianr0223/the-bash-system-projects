import type { Metadata } from "next";
import { Bebas_Neue, JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "600", "800"],
});

export const metadata: Metadata = {
  title: "BINGO · Tablero de Registro",
  description: "Tablero de registro para bingo de 75 bolas con voz y animaciones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${bebas.variable} ${jetbrains.variable} ${sora.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
