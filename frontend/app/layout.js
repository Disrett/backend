import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "../auth";
import SessionProvider from "./components/providers/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sans Limites",
  description: "Site Sans Limites",
};

/**
 * RootLayout — Server Component.
 *
 * On récupère la session côté serveur (via le cookie httpOnly) et on la passe
 * au SessionProvider client. Cela évite un flash de contenu non-authentifié
 * (le client reçoit la session dès le premier rendu HTML).
 */
export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
