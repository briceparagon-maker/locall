import "./globals.css";

export const metadata = {
  title: "FILTRAVIS - Gestion de la Réputation Locale",
  description: "Solution intelligente d'avis et Smart QR Code pour commerçants.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
