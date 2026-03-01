import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pokino Live",
  description: "Juego multijugador tipo Kahoot basado en Pokino",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
