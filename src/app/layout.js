import Header from "@/components/main/Header";
import Footer from "@/components/main/Footer";
import SessionWrapper from "@/components/sessionWrapper";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "MyMeme : Ai generated memes",
  description:
    "A simple ai based meme generation site where users can generate mems through ai and post them.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-indigo-100 to-purple-50 min-h-screen">
        
        <SessionWrapper>
          <Header />
        {children}
        <Footer />
        <Toaster />
        </SessionWrapper>
      </body>
    </html>
  );
}
