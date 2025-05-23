import AdvancedPageTransition from "@/components/PageTransition";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AdvancedPageTransition>
          {children}
          </AdvancedPageTransition>
      </body>
    </html>
  );
}
