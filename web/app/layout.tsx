import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TopBar from "@/components/TopBar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <TopBar />
          <Navbar />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
